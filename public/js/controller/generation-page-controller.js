import { BasePageController } from './base-page-controller.js';
import { GenerationView } from '../view/generation-view.js';
import { GenerationPageModel } from '../model/generation-page-model.js';
import { GenerationModel } from '../model/generation-model.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { txt2img_steps, txt2vid_steps, img2vid_steps, doc2vid_steps, url2vid_steps } from "../config/mediaGeneration-config.js";
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
		this._handleAcknowledge = this.handleAcknowledge.bind(this);
    	this._handleGenerate = this.handleGenerate.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	start(type) {
		this.model.currentStepIndex = 0;
		this.model.currentStepSpeak = false;
		this.setSteps(type);
		this.model.buildSpeechListFromSteps();
		// document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
		// 	detail: { language: appSettings.language, timeout: false }
		// }));
		this.view.resetGenerateFormPage();
		this.showCurrentStep();
	}

	// To set the corresponding config steps
	setSteps(type) {
		switch (type) {
			case Events.TXT2IMG_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + txt2img_steps);
				this.model.steps = txt2img_steps;
				this.model.generationType = this.model.GENERATION_TYPES.TXT2IMG;
				this.view.setGenerationType(this.view.generationPageHeaders.TXT2IMG);
				break;
			case Events.TXT2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + txt2vid_steps);
				this.model.steps = txt2vid_steps;
				this.model.generationType = this.model.GENERATION_TYPES.TXT2VID;
				this.view.setGenerationType(this.view.generationPageHeaders.TXT2VID);
				break;
			case Events.IMG2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + img2vid_steps);
				this.model.steps = img2vid_steps;
				this.model.generationType = this.model.GENERATION_TYPES.IMG2VID;
				this.view.setGenerationType(this.view.generationPageHeaders.IMG2VID);
				break;
			case Events.DOC2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + doc2vid_steps);
				this.model.steps = doc2vid_steps;
				this.model.generationType = this.model.GENERATION_TYPES.DOC2VID;
				this.view.setGenerationType(this.view.generationPageHeaders.DOC2VID);
				break;
			case Events.URL2VID_PRESS:
				console.log('[generation-page-controller] setting steps = ' + type + " : " + url2vid_steps);
				this.model.steps = url2vid_steps;
				this.model.generationType = this.model.GENERATION_TYPES.URL2VID;
				this.view.setGenerationType(this.view.generationPageHeaders.URL2VID);
				break;
		}
	}

	showCurrentStep() {
		if (!this.isActive) return;

		console.log('[generation-page-controller] Current step is = ' + this.model.currentStepIndex);

    	//Clear user bubble to ready for next step
    	EventBus.emit(Events.CHAT_UPDATE, { otherText: "" });
    	document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {}));

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

	onUpdateLanguage(language){
		this.model.buildSpeechListFromSteps(this.model.steps);
		this.currentStepSpeak = false;
		this.showCurrentStep();
	}

	onUpdateInputMode(mode) {
		console.log('[generation-page-controller] switching to mode: ' + mode);

		this.showCurrentStep();

		const currentStep = this.model.steps[this.model.currentStepIndex];
		console.log('[generation-page-controller] currentStep: ' + JSON.stringify(currentStep));

		if (appSettings.inputMode === "voice" && currentStep.type === "prompt") {
			this.setupTranscribeForVoiceCommand(true, true);
			this.isTranscribeActive = true;
			console.log('[generation-page-controller] setupTranscribeForVoiceCommand(true)');
		} else {
			if (this.isTranscribeActive) {
				this.setupTranscribeForVoiceCommand(false);
				this.isTranscribeActive = false;
				console.log('[generation-page-controller] setupTranscribeForVoiceCommand(false)');
			}
		}
	}

	onAvatarSpeakCompleted() {
		if (!this.model.currentStepSpeak) {
			this.model.currentStepSpeak = true;

			const step = this.model.currentStep;

			if (appSettings.inputMode === 'voice' && step.type === "prompt") {
				this.setupTranscribeForVoiceCommand(true, true);
				this.model.isTranscribeActive = true;
			} else if (this.model.isTranscribeActive) {
				this.setupTranscribeForVoiceCommand(false);
				this.model.isTranscribeActive = false;
			}
		}
	}

	handleActionBarClicked(key) {
		if (!this.isActive) return;

		const step = this.model.currentStep;

		switch (key) {
			case 'back':
				if(appSettings.inputMode == "voice"){
					this.setupTranscribeForVoiceCommand(false);
					this.model.isTranscribeActive = false;
				}
				this.previousStep();
				break;
			case 'help':
				this.showCurrentStep();
				if (appSettings.inputMode === 'voice') {
					this.setupTranscribeForVoiceCommand(true, true);
					this.model.isTranscribeActive = true;
				} else {
					if (this.model.isTranscribeActive) {
						this.setupTranscribeForVoiceCommand(false);
						this.model.isTranscribeActive = false;
					}
				}
				break;
			case 'acknowledge':
				if(appSettings.inputMode == "voice"){
					this.setupTranscribeForVoiceCommand(false);
					this.model.isTranscribeActive = false;
				}
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
			console.log('[generation-page-controller] enabling voice commands');
			document.addEventListener("aws-transcribe-update", this._handleTranscribeEvent);
			document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
				detail: { language: appSettings.language, timeout: timeout }
			}));
			document.dispatchEvent(new CustomEvent('aws-update-timeout', { detail: { timeout } }));
			this.model.isTranscribeActive = true;
		} else {
			console.log('[generation-page-controller] disabling voice commands');
			document.removeEventListener("aws-transcribe-update", this._handleTranscribeEvent);
			document.dispatchEvent(new CustomEvent('aws-stop-transcribe', { detail: { language: 'en-US' } }));
			document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {}));
			this.model.isTranscribeActive = false;
		}
	}

	handleAcknowledge() {
		EventBus.emit(AvatarEvents.STOP, {});
		this.onContinue();
		this.nextStep();
	}

	handleGenerate() {
		this.onContinue();
		this.onSubmit();
	}

	// Handles ongoing/partial voice input, only used for selection of options
	async handleTranscribeEvent(e) {
		console.log('[generation-page-controller] transcribe detail: ' + e.detail);
		const step = this.model.currentStep;
		if (step.type !== 'prompt') return;

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
	// Handles complete transcription, used for both prompts and selection
	async handleTranscribeComplete(e) {
		const step = this.model.currentStep;
		console.log('[generation-page-controller] Transcribe complete: ' + e.details);
		const transcript = e.detail;
		if (!transcript) return;
		if (step.type === 'prompt') {
			const inputSelector = `textarea[name="${step.input}"]`;
			const textarea = document.querySelector(inputSelector);
			if (textarea) {
				textarea.value = transcript;
				textarea.dispatchEvent(new Event('input')); // trigger input validation
				// this.setupTranscribeForVoiceCommand(false);
			}
		} else if (step.type === 'selection') {
			// Find the matching option in current step
			const normalizedTranscript = this.model.normalize(transcript);
			const matched = step.options.find(option => {
				const label = typeof option === 'object' ? option[appSettings.language] : option;
				return normalizedTranscript.includes(this.normalize(label));
			});

			if (matched) {
				const label = typeof matched === 'object' ? matched[appSettings.language] : matched;
				
				// Find and click the matching button in DOM
				const buttons = document.querySelectorAll('.option-button');
				for (const btn of buttons) {
					if (this.model.normalize(btn.textContent) === this.model.normalize(label)) {
						btn.click();
						console.log(`[generation-page-controller] ✅ Matched and selected: ${label}`);

						// this.setupTranscribeForVoiceCommand(false);
						break;
					}
				}
			}
		}
	}

	async handleFileUpload(e) {
		try {
			const file = e.detail.file;
			console.log('[generation-page-controller] recieved file: ' + file);
			if (!(file instanceof Blob)) {
				throw new TypeError("Invalid file type passed to handleFileUpload.");
			}

			const mime = file.type;
			let base64Only;

			// IMAGE → use existing helper
			if (mime.startsWith("image/")) {
				const base64Img = await this.model.convertToBase64Img(file);
				base64Only = base64Img.replace(/^data:image\/\w+;base64,/, "");
				console.log( "[generation-page-controller] Uploaded image file is: " + base64Only);

			// POWERPOINT → read via FileReader	
			} else if (
				mime === "application/pdf" ||
				mime === "application/vnd.ms-powerpoint" ||
				mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
					console.log('[generation-page-controller] Uploaded file is: ' + file);
					this.model.uploadedFile = file;

			// UNHANDLED TYPE
			} else {
				throw new TypeError(`Unsupported file type: ${mime}`);
			}
		} catch (error) {
			console.error("[generation-page-controller] Failed to upload file: " + error);
		}
	}

	buildPrompt(userInput) {
		switch (this.model.generationType) {
			case 'txt2img':
				return this.buildPrompt_txt2img(userInput);
			case 'img2vid':
			case 'txt2vid':
				return this.buildPrompt_txt2vid(userInput);
			case 'doc2vid':
				return userInput;
			case 'url2vid':
				return userInput;
		}
	}

	// Text to Image
    buildPrompt_txt2img(formData) {
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
	buildPrompt_txt2vid(formData) {
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
		// Store prompt answers
		this.view.element.querySelectorAll('textarea, input[type="hidden"]').forEach(field => {
			this.model.storeAnswer(field.name, field.value.trim());
		});
	}

	getIntent() {
		if (this.model.generationType == this.model.GENERATION_TYPES.TXT2IMG) {
			return messageIntent.TXT2IMG;
		} else if (this.model.generationType == this.model.GENERATION_TYPES.TXT2VID) {
			return messageIntent.TXT2VID;
		} else if (this.model.generationType == this.model.GENERATION_TYPES.IMG2VID) {
			return messageIntent.IMG2VID;
		}
	}

    /**
     * Controller function to poll KlingAI task until it's done.
     * Returns image results once task completes.
     */
    async pollKlingAITask(taskID, options = {}) {

        console.log('[generation-page-controller] Polling created KlingAI task: ' + taskID);
        const intervalMs = options.intervalMs || 3000;
        const maxWaitMs = options.maxWaitMs || 5 * 60 * 10000;

        let totalWait = 0;

        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const result = await this.generationModel.queryTask_KlingAI(taskID, this.getIntent());

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
		console.log('[generation-page-controller] Collected data: ' + JSON.stringify(this.model.userInput, null, '\t'));
		const data = this.buildPrompt(this.model.userInput);
		console.log('[generation-page-controller] Built and sending prompt: ' + JSON.stringify(data, null, '\t'));

		try {
			const taskId = await this.generationModel.generate(this.model.generationType, data, this.model.uploadedImage, this.model.uploadedFile);
			if (taskId) {
				this.view.showLoading();
				const result = await this.pollKlingAITask(taskId);
				console.log('[generation-page-controller] Recieved Result: ' + JSON.stringify(result, null, '\t'));
				if (result) {
					this.view.showResult(result.urls[0]);
					// Emit event with media to allow UI update/show media
					EventBus.emit(Events.MEDIA_GENERATED, { mediaUrl: result.urls[0] });
				}
			} else {
				throw new Error('Failed [generation-model] generate() call');
			}

			// Optionally reset questionnaire or navigate elsewhere
			// this.model.currentStepIndex = 0;
			// this.showCurrentStep();

		} catch (err) {
			this.view.showError(err);
			console.error(err);
			EventBus.emit(AvatarEvents.SPEAK, { message: 'Failed to generate media, please try again.', gesture: '' });
		}
	}

	onEnter() {
		super.onEnter();
		this.actionBar.show();

		this.view.on("readyForAcknowledge", () => this.actionBar.enableAcknowledge(true));
		this.view.on("notReadyForAcknowledge", () => this.actionBar.enableAcknowledge(false));
		this.view.on("quizAnswered", e => this.onQuizAnswered(e.detail));
		this.view.on("fileUploaded", this.handleFileUpload);

		this.actionBar.on("acknowledged", this._handleAcknowledge);
		this.actionBar.on("generate", this._handleGenerate);
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
		this.view.off("fileUploaded", this.handleFileUpload);

	    this.actionBar.off("acknowledged", this._handleAcknowledge);
		this.actionBar.off("generate", this._handleGenerate);
		this.actionBar.off("action-button-clicked", e => this.handleActionBarClicked(e.detail));

		document.dispatchEvent(new CustomEvent('aws-stop-transcribe', { detail: { language: 'en-US' } }));
		document.removeEventListener("aws-transcribe-update", this._handleTranscribeEvent);
		document.removeEventListener("aws-transcribe-complete", this._handleTranscribeComplete);

		EventBus.off(Events.UPDATE_LANGUAGE, e => this.onUpdateLanguage(e.detail));
		EventBus.off(Events.UPDATE_INPUTMODE, e => this.onUpdateInputMode(e.detail));
		EventBus.off(AvatarEvents.SPEAK_COMPLETED, e => this.onAvatarSpeakCompleted(e.detail));
	}
}
