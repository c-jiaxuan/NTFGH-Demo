import { BasePageController } from './base-page-controller.js';
import { ChatbotView } from '../view/chatbot-view.js';
import { ChatModel } from '../model/chat-model.js';
import { chatbot_config } from "../config/chatbot-config.js";
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { appSettings } from '../config/appSettings.js';
import { llm_config } from '../config/llm-config.js';

export class ChatbotPageController extends BasePageController {
    constructor(id){
        const view = new ChatbotView(id);
        const model = new ChatModel();
        super(id, view, model);
    
        this.view.setLanguage(appSettings.language);
    
        this.view.bindSend(this.handleSend.bind(this));

        this.view.setUserInputHandler(this.handleSend.bind(this));



        this.isTranscribeActive = false;
    }

    // async handleSend(userInput) {
    //     const userMessage = this.model.addMessage("User", userInput);
    //     this.view.displayMessage(userMessage.sender, userMessage.text);

    //     // Await the bot response
    //     const botText = await this.model.getBotResponse(userInput);

    //     const botMessage = this.model.addMessage("Bot", botText);
    //     this.view.displayMessage(botMessage.sender, botMessage.text);
    // }

    async handleSend(userInput) {
        this.model.addMessage("User", { text: userInput });
        this.view.displayMessage("User", { text: userInput });

        EventBus.emit(AvatarEvents.SPEAK, { message: this.getTranslatedMessage('wait_msg', appSettings.language) });

        this.view.displayBotLoading();

        const { content, followUp } = await this.model.getBotResponse(userInput, llm_config.bot_language);

        console.log('img: ' + img);
        const messageContent = this.buildMessageContent({
            text: content ?? this.getTranslatedMessage('error_msg', appSettings.language),
            image: img,
            followUp
        });

        this.view.displayMessage("Bot", messageContent, messageId);

        EventBus.emit(AvatarEvents.SPEAK, { message: content });

        this.view.removeBotLoading();
    }


    onEnter() {
        super.onEnter();
        
        console.log('Chatbot page initialized');

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

        console.log('Leaving Chatbot page');

        EventBus.off(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.off(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
        EventBus.off(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })

        document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
        detail: { language: 'en-US' }
        }));

        document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
        document.removeEventListener("aws-transcribe-complete", this.handleTranscribeComplete);
    }

    start() {
        console.log('Chatbot page start');

        const welcomeMsg = this.getTranslatedMessage('start_msg', appSettings.language); // or 'zh'

        EventBus.emit(AvatarEvents.SPEAK, { message: welcomeMsg } );

        this.model.addMessage("Bot", { text: welcomeMsg });
        this.view.displayMessage("Bot", { text: welcomeMsg });
    }

    onUpdateLanguage(language) {
        console.log('Chatbot language changed to ' + language);



    }

    onUpdateInputMode(input) {
        console.log('Chatbot input mode changed to ' + input);

        if (appSettings.inputMode == 'voice') {
            document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
                detail: { language: appSettings.language, timeout: true }
            }));
            // this.setupTranscribeForVoiceCommmand(true);
            this.isTranscribeActive = true;   
        } else {
            document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
                 detail: { language: appSettings.language }
            }));
            //this.setupTranscribeForVoiceCommmand(false);
            this.isTranscribeActive = false;   
        }
    }

    getTranslatedMessage(title, lang = 'en') {
        return chatbot_config[title]?.[lang] || '';
    }

    onAvatarSpeakCompleted(e) {
        
    }

    // Normalize strings
    normalize(str) {
        return str.toLowerCase().replace(/\s+/g, '');
    }

    async handleTranscribeEvent(e) {
        console.log("transcribe" + e.detail);
    }

    async handleTranscribeComplete(e) {
        const transcript = this.normalize(e.detail);
        if(transcript == "") {
            return;
        }
        
        console.log("transcribe complete = " + transcript);
        
        this.view.setTranscribeInput(transcript);

        document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
            detail: { }
        }));
    }

    setupTranscribeForVoiceCommmand(enabled, timeout = false) {
        if(enabled) {
            //Listen to transcribe event
            document.addEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
            //Start transcribing

            document.dispatchEvent(new CustomEvent('aws-update-timeout', {
                detail: { timeout: timeout }
            }));
        } else {
            //Remove transcribe listener
            document.removeEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
            //Stop transcribing
            // document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            //   detail: { language: appSettings.language }
            // }));
            document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
                    detail: { }
            }));
        }
    }

    buildMessageContent({ text, image, video, audio, file, followUp = [] }) {
        const messageContent = {};

        if (text) {
            messageContent.text = text;
        }

        if (image) {
            messageContent.image = image;
        }

        if (video) {
            messageContent.video = video;
        }

        if (audio) {
            messageContent.audio = audio;
        }

        if (file) {
            messageContent.file = file;
        }

        if (followUp.length > 0) {
            messageContent.buttons = followUp.map((label, index) => ({
                label,
                value: `option_${index}`
            }));
        }

        console.log('built messageContent: ' + JSON.stringify(messageContent));
        return messageContent;
    }
}