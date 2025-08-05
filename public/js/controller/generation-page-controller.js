import { BasePageController } from './base-page-controller.js';
import { GenerationView } from '../view/generation-view.js';
import { GenerationPageModel } from '../model/generation-page-model.js';
import { GenerationModel } from '../model/generation-model.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { text2Img_steps, text2Vid_steps, img2Vid_steps } from "../config/mediaGeneration-config.js";
import { ActionBarController } from './action-bar-controller.js';
import { appSettings } from '../config/appSettings.js';
import { messageIntent } from '../config/chatbot-config.js';

export class GenerationPageController extends BasePageController {
	constructor(id) {
		const view = new GenerationView(id);
		const model = new GenerationPageModel();
		super(id, view, model);

		this.generationModel = new GenerationModel();

		this.actionBar = new ActionBarController('bottom-action-bar');

		this._handleTranscribeEvent = this.handleTranscribeEvent.bind(this);
		this._handleTranscribeComplete = this.handleTranscribeComplete.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	start(type) {
		this.model.currentStepIndex = 0;
		this.model.currentStepSpeak = false;
		this.setSteps(type);
		this.model.buildSpeechListFromSteps();
		// document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
		//   detail: { language: appSettings.language, timeout: false }
		// }));
		this.view.resetGenerateFormPage();
		this.showCurrentStep();
	}

	// To set the corresponding config steps
	setSteps(type) {
		switch (type) {
			case Events.TEXT2IMG_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + text2Img_steps);
				this.model.steps = text2Img_steps;
				this.model.generationType = "txt2img";
			break;
			case Events.TEXT2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + text2Vid_steps);
				this.model.steps = text2Vid_steps;
				this.model.generationType = "txt2vid";
			break;
			case Events.IMG2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + vid2Img_steps);
				this.model.steps = img2Vid_steps;
				this.model.generationType = "img2vid";
			break;
		}
	}

	showCurrentStep() {
		if (!this.isActive) return;

		console.log('[generation-page-controller] Current step is = ' + this.model.currentStepIndex);

		const isLastStep = this.model.currentStepIndex === this.model.steps.length - 1;

		this.view.renderStep(appSettings.language, this.model.currentStep, isLastStep);

		// Speech preload for speaking current question
		this.model.buildSpeechListFromSteps(this.model.steps);
		if (!this.model.currentStepSpeak) {
			this.speakStep(this.model.currentStepIndex);
		}

		this.actionBar.update(this.model.currentStepIndex > 0, true, !isLastStep, isLastStep);
		this.actionBar.enableAcknowledge(false);
	}

	nextStep() {
		if (this.model.currentStepIndex < this.model.steps.length - 1) {
			this.model.currentStepIndex++;
			this.model.currentStepSpeak = false;
			this.showCurrentStep();
		} else {
			// End of steps, maybe reset or navigate home
			// EventBus.emit(Events.HOME_PRESS);
		}
	}

	previousStep() {
		if (this.model.currentStepIndex > 0) {
			this.model.currentStepIndex--;
			this.model.currentStepSpeak = false;
			this.showCurrentStep();
		}
	}

	onAvatarSpeakCompleted() {
		if (!this.model.currentStepSpeak) {
			this.model.currentStepSpeak = true;
			if (appSettings.inputMode === 'voice') {
				this.setupTranscribeForVoiceCommand(true, ['next-of-kin', 'adl'].includes(this.model.currentStep.type));
				this.model.isTranscribeActive = true;
			} else if (this.model.isTranscribeActive) {
				this.setupTranscribeForVoiceCommand(false);
				this.model.isTranscribeActive = false;
			}
		}
	}

	handleActionBarClicked(key) {
		if (!this.isActive) return;

		if (appSettings.inputMode === 'voice' && (key === 'back' || key === 'acknowledge')) {
			this.setupTranscribeForVoiceCommand(false);
			this.model.isTranscribeActive = false;
		}

		switch (key) {
			case 'back':
				this.previousStep();
				break;
			case 'help':
				this.showCurrentStep();
				if (appSettings.inputMode === 'voice') {
					this.setupTranscribeForVoiceCommand(true, ['next-of-kin', 'adl'].includes(this.model.currentStep.type));
					this.model.isTranscribeActive = true;
				}
				break;
			case 'acknowledge':
				this.actionBar.countdownAcknowledgeBtn(true);
				break;
			case 'generate':
				this.actionBar.countdownGenerateBtn(true);
				break;
		}
	}

	speakStep(index) {
		const line = this.model.allStepSpeech[index];
		if (!line) return;
		EventBus.emit(AvatarEvents.SPEAK, { message: line.text, gesture: line.gesture });
	}

	setupTranscribeForVoiceCommand(enabled, timeout = false) {
		if (enabled) {
			document.addEventListener("aws-transcribe-update", this._handleTranscribeEvent);
			document.dispatchEvent(new CustomEvent('aws-update-timeout', { detail: { timeout } }));
			this.model.isTranscribeActive = true;
		} else {
			document.removeEventListener("aws-transcribe-update", this._handleTranscribeEvent);
			document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {}));
			this.model.isTranscribeActive = false;
		}
	}

	async handleTranscribeEvent(e) {
		const step = this.model.currentStep;
		if (step.type !== 'assessment') return;

		const transcript = this.model.normalize(e.detail);
		if (!step.options) return;

		// Try matching transcribed words with options to select automatically
		const matched = step.options.find(option => {
			const label = typeof option === 'object' ? option[appSettings.language] : option;
			return transcript.includes(this.model.normalize(label));
		});

		if (matched) {
			const label = typeof matched === 'object' ? matched[appSettings.language] : matched;
			const buttons = document.querySelectorAll('.option-button');
			for (const btn of buttons) {
				if (this.model.normalize(btn.textContent) === this.model.normalize(label)) {
					btn.click();
					this.setupTranscribeForVoiceCommand(false);
					break;
				}
			}
		}
	}

	// TBD: Change to fit the new types
	async handleTranscribeComplete(e) {
		const step = this.model.currentStep;
		if (!['next-of-kin', 'adl'].includes(step.type)) return;
		const transcript = this.model.normalize(e.detail);
		if (!transcript) return;

		if (step.type === 'adl') {
			const classification = await this.model.classifyAdl(transcript, this.model.currentStepIndex);
			if (!classification) {
				EventBus.emit(AvatarEvents.SPEAK, { message: "I am not sure what you have sent, please try again.", gesture: "" });
				return;
			}
			const buttons = document.querySelectorAll('.option-button');
			for (const btn of buttons) {
				if (this.model.normalize(btn.textContent) === this.model.normalize(classification.output.choice)) {
					btn.click();
					this.setupTranscribeForVoiceCommand(false);
					break;
				}
			}
			EventBus.emit(AvatarEvents.SPEAK, { message: this.model.formatResponse(classification), gesture: "" });
		} else if (step.type === 'next-of-kin') {
			const result = await this.model.callGramanerHandler(transcript);
			if (!result) {
				EventBus.emit(AvatarEvents.SPEAK, { message: "I am not sure what you have sent, please try again.", gesture: "" });
				return;
			}
			const fillMap = {
				name: result.name,
				relationship: result.relationship,
				phone: result.phone_number,
				address: result.address,
			};

			const inputs = document.querySelectorAll('.field-layout input');
			inputs.forEach(input => {
				const label = input.name?.toLowerCase();
				for (const key in fillMap) {
					if (label.includes(key)) {
						input.value = fillMap[key] || '';
						break;
					}
				}
			});

			inputs.forEach(input => input.dispatchEvent(new Event('keyup')));
			this.setupTranscribeForVoiceCommand(false);
		}
	}

	buildPrompt(userInput) {
		switch (this.model.generationType) {
			case 'txt2img':
				return this.buildPrompt_text2img(userInput);
			case 'txt2vid':
				return this.buildPrompt_text2vid(userInput);
			case 'img2vid':

				break;
			case 'doc2vid':
				break;
			case 'url2vid':
				break;
		}
	}

	// Text to Image
    buildPrompt_text2img(formData) {
        const {
            object,
			environment,
			action,
			time,
			mood,
			prompt
        } = formData;

        const parts = [];

        if (object) parts.push(`featuring ${object}`);
        if (environment) parts.push(`set in ${environment}`);
        if (action) parts.push(`where ${action}`);
        if (time) parts.push(`during ${time}`);
        if (mood) parts.push(`with a ${mood} style`);

        const extraPrompt = prompt ? ` ${prompt}` : "";

        return `An image ${parts.join(", ")} ${extraPrompt}`.trim();
    }

	// Text to Video
	buildPrompt_text2vid(formData) {
		const {
			subject,
			movement,
			background,
			BGMovement,
			motion,
			prompt
		} = formData;

		const parts = [];

		if (subject) parts.push(`a scene showing ${subject}`);
		if (movement) parts.push(`performing ${movement}`);
		if (background) parts.push(`against ${background}`);
		if (BGMovement) parts.push(`where ${BGMovement}`);
		if (motion) parts.push(`captured with ${motion} camera motion`);

		const extraPrompt = prompt ? ` ${prompt}` : "";

		return `A video of ${parts.join(", ")}${extraPrompt}`.trim();
	}

	// Store the userinput on continuing each step
	onContinue() {
		this.view.element.querySelectorAll('textarea').forEach(textarea => {
        	this.model.storeAnswer(textarea.name, textarea.value.trim());
      	});
	}

    /**
     * Controller function to poll KlingAI task until it's done.
     * Returns image results once task completes.
     */
    async pollKlingAITask(taskID, options = {}) {

        console.log('[generation-page-controller] Polling created KlingAI task: ' + taskID);
        const intervalMs = options.intervalMs || 3000;
        const maxWaitMs = options.maxWaitMs || 5 * 60 * 1000;

        let totalWait = 0;

        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const result = await this.generationModel.queryTask_KlingAI(taskID, messageIntent.TXT2IMG);

                    if (result) {
                        clearInterval(intervalId);
                        return resolve(result); // Images returned
                    }

                    totalWait += intervalMs;
                    if (totalWait >= maxWaitMs) {
                        clearInterval(intervalId);
                        return reject(new Error('Polling timed out.'));
                    }

                } catch (err) {
                    clearInterval(intervalId);
                    return reject(err);
                }
            }, intervalMs);
        });
    }

	// Called on 'submit' event from view's submit button on last step
	async onSubmit() {
		console.log('[generation-page-controller] Collected data: ' + JSON.stringify(this.model.userInput));
		const data = this.buildPrompt(this.model.userInput);
		console.log('[generation-page-controller] Built and sending prompt: ' + JSON.stringify(data));

		try {
			const taskId = await this.generationModel.generate(this.model.generationType, data);
			if (taskId) {
				this.view.showLoading();
				const result = await this.pollKlingAITask(taskId);
				console.log('[generation-page-controller] Recieved Result: ' + JSON.stringify(result));
				if (result) {
					this.view.showResult(result.urls);
					// Emit event with media to allow UI update/show media
					EventBus.emit(Events.MEDIA_GENERATED, { mediaUrl: data.mediaUrl });
				}
			}

			// Optionally reset questionnaire or navigate elsewhere
			// this.model.currentStepIndex = 0;
			// this.showCurrentStep();

		} catch (err) {
			this.view.showError(err);
			console.error('Error generating media:', err);
			EventBus.emit(AvatarEvents.SPEAK, { message: 'Failed to generate media, please try again.', gesture: '' });
		}
	}

	onEnter() {
		super.onEnter();
		this.actionBar.show();

		this.view.on("readyForAcknowledge", () => this.actionBar.enableAcknowledge(true));
		this.view.on("notReadyForAcknowledge", () => this.actionBar.enableAcknowledge(false));
		this.view.on("quizAnswered", e => this.onQuizAnswered(e.detail));
		this.actionBar.on("acknowledged", () => {
			EventBus.emit(AvatarEvents.STOP, {});
			this.onContinue();
			this.nextStep();
		});
		this.actionBar.on("generate", () => {
			this.onContinue();
			this.onSubmit();
		});

		this.actionBar.on("action-button-clicked", e => this.handleActionBarClicked(e.detail));

		document.addEventListener("aws-transcribe-update", this._handleTranscribeEvent);
		document.addEventListener("aws-transcribe-complete", this._handleTranscribeComplete);

		EventBus.on(Events.UPDATE_LANGUAGE, e => this.onUpdateLanguage(e.detail));
		EventBus.on(Events.UPDATE_INPUTMODE, e => this.onUpdateInputMode(e.detail));
		EventBus.on(AvatarEvents.SPEAK_COMPLETED, e => this.onAvatarSpeakCompleted(e.detail));
	}

	onExit() {
		super.onExit();
		this.actionBar.hide();

		this.view.off("readyForAcknowledge", () => this.actionBar.enableAcknowledge(true));
		this.view.off("notReadyForAcknowledge", () => this.actionBar.enableAcknowledge(false))
		this.view.off("quizAnswered", e => this.onQuizAnswered(e.detail));
		this.actionBar.off("acknowledged", () => this.nextStep());
		this.actionBar.off("acknowledged", () => this.onContinue());
		this.actionBar.off("generate", () => this.onContinue());
		this.actionBar.off("generate", () => this.onSubmit());
		this.actionBar.off("action-button-clicked", e => this.handleActionBarClicked(e.detail));

		document.dispatchEvent(new CustomEvent('aws-stop-transcribe', { detail: { language: 'en-US' } }));
		document.removeEventListener("aws-transcribe-update", this._handleTranscribeEvent);
		document.removeEventListener("aws-transcribe-complete", this._handleTranscribeComplete);

		EventBus.off(Events.UPDATE_LANGUAGE, e => this.onUpdateLanguage(e.detail));
		EventBus.off(Events.UPDATE_INPUTMODE, e => this.onUpdateInputMode(e.detail));
		EventBus.off(AvatarEvents.SPEAK_COMPLETED, e => this.onAvatarSpeakCompleted(e.detail));
	}
}
