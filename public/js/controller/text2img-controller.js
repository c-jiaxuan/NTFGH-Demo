import { BasePageController } from './base-page-controller.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { chatbot_config } from '../config/chatbot-config.js';
import { appSettings } from '../config/appSettings.js';
import { Text2ImgView } from '../view/text2img-view.js';
import { GenerationModel } from '../model/generation-model.js';
import { messageIntent } from '../config/chatbot-config.js';

export class Text2ImgController extends BasePageController {
    constructor(id) {
            const view = new Text2ImgView(id);
            const model = new GenerationModel();
            super(id, view, model);

            this.view.on("submit", async (e) => {
            try {
                console.log('[text2img-controller] Recieved form data: ' + JSON.stringify(e.detail));
                const prompt = this.buildPromptFromForm(e.detail);
                console.log('[text2img-controller] Built and sending prompt: ' + prompt);
                const taskId = await this.model.generate("text2img", prompt);
                if (taskId) {
                    this.view.showLoading();
                    const result = await this.pollKlingAITask(taskId);
                    console.log('[text2img-controller] Recieved Result: ' + JSON.stringify(result));
                    if (result) {
                        this.view.showResult(result.urls);
                    }
                }
            } catch (err) {
                // this.view.output.innerHTML = `<p>Error: ${err.message}</p>`;
                this.view.showError(err);
                console.log('[text2img-controller] err: ' + err);
            }
        });
    }

    start() {
        // document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
        //     detail: { language: appSettings.language, timeout: false }
        // }));

        // const welcomeMsg = this.getTranslatedMessage('start_msg', appSettings.language); // or 'zh'

        EventBus.emit(AvatarEvents.SPEAK, {
            message: this.getTranslatedMessage('text2img_msg', appSettings.language),
            gesture: chatbot_config.text2img_msg.gst
        });
    }

    onEnter() {
        super.onEnter();
        
        console.log('[text2img-controller] text2img page initialized');

        //Listen to global events
        EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
        EventBus.on(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })

        document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
        document.addEventListener("aws-transcribe-complete", this.handleTranscribeComplete.bind(this));

        // EventBus.emit(AvatarEvents.PRELOAD, { detail: speechTexts });
    }

    onExit() {
        super.onExit();

        console.log('[text2img-controller] Leaving text2img page');

        EventBus.off(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.off(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
        EventBus.off(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })

        document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
        }));

        document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
        document.removeEventListener("aws-transcribe-complete", this.handleTranscribeComplete);
    }

    onAvatarSpeakCompleted(e) {
        
    }

    // Normalize strings
    normalize(str) {
        return str.toLowerCase().replace(/\s+/g, '');
    }

    async handleTranscribeEvent(e) {
        console.log("[text2img-controller] transcribe" + e.detail);
    }

    async handleTranscribeComplete(e) {
        const transcript = this.normalize(e.detail);
        if(transcript == "") {
            return;
        }
        
        console.log("[text2img-controller] transcribe complete = " + transcript);

        document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
            detail: { }
        }));
    }

    onUpdateLanguage(language){
        console.log('[text2img-controller]  Switching language from: ' + appSettings.language + " to " + language);
    }

    onUpdateInputMode(mode){
        console.log('[text2img-controller] Input Mode: ' + mode);

        if(appSettings.inputMode == "voice") {
            // this.setupTranscribeForVoiceCommmand(true, steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl");
            // this.isTranscribeActive = true;     
        } else {
            if(this.isTranscribeActive) {
                // this.setupTranscribeForVoiceCommmand(false);
                // this.isTranscribeActive = false;
            }
        }
    }


    buildPromptFromForm(formData) {
        const {
            objects, environment, actions, time, mood, prompt
        } = formData;

        const parts = [];

        if (objects) parts.push(`featuring ${objects}`);
        if (environment) parts.push(`set in ${environment}`);
        if (actions) parts.push(`where ${actions}`);
        if (time) parts.push(`during ${time}`);
        if (mood) parts.push(`with a ${mood} style`);

        const extraPrompt = prompt ? ` ${prompt}` : "";

        return `An image ${parts.join(", ")} ${extraPrompt}`.trim();
    }

    getTranslatedMessage(title, lang = 'en') {
        return chatbot_config[title]?.[lang] || '';
    }

    /**
     * Controller function to poll KlingAI task until it's done.
     * Returns image results once task completes.
     */
    async pollKlingAITask(taskID, options = {}) {

        console.log('[text2img-controller] Polling created KlingAI task: ' + taskID);
        const intervalMs = options.intervalMs || 3000;
        const maxWaitMs = options.maxWaitMs || 5 * 60 * 1000;

        let totalWait = 0;

        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const result = await this.model.queryTask_KlingAI(taskID, messageIntent.TXT2IMG);

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
}