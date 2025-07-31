import { BasePageController } from './base-page-controller.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { appSettings } from '../config/appSettings.js';
import { Text2VidView } from '../view/text2vid-view.js';
import { GenerationModel } from '../model/generation-model.js';

export class Text2VidController extends BasePageController {
    constructor(id) {
            const view = new Text2VidView(id);
            const model = new GenerationModel();
            super(id, view, model);

            this.view.on("submit", async (e) => {
            try {
                const result = await this.model.generate("text2video", e.detail);
                this.view.showResult(result.url);
            } catch (err) {
                this.view.output.innerHTML = `<p>Error: ${err.message}</p>`;
            }
        });
    }

    start() {
        // document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
        //     detail: { language: appSettings.language, timeout: false }
        // }));

        const welcomeMsg = this.getTranslatedMessage('start_msg', appSettings.language); // or 'zh'

        EventBus.emit(AvatarEvents.SPEAK, { message: welcomeMsg } );
    }

    onEnter() {
        super.onEnter();
        
        console.log('[text2vid] text2vid page initialized');

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

        console.log('[text2vid] Leaving text2img page');

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
        console.log("[text2vid] transcribe" + e.detail);
    }

    async handleTranscribeComplete(e) {
        const transcript = this.normalize(e.detail);
        if(transcript == "") {
            return;
        }
        
        console.log("[text2vid] transcribe complete = " + transcript);

        document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
            detail: { }
        }));
    }

    onUpdateLanguage(language){
        console.log('[text2vid]  Switching language from: ' + appSettings.language + " to " + mode);
    }

    onUpdateInputMode(mode){
        console.log('[text2vid] Input mode: '+ mode);

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
}