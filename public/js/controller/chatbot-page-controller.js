import { BasePageController } from './base-page-controller.js';
import { ChatbotView } from '../view/chatbot-view.js';
import { ChatModel } from '../model/chat-model.js';
import { chatbot_config, imageKeywords, videoKeywords } from "../config/chatbot-config.js";
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

    async handleSend(userInput) {
        const messageId = `msg-${Date.now()}`;
        this.model.addMessage("User", { text: userInput }, messageId);
        this.view.displayMessage("User", { text: userInput });

        EventBus.emit(AvatarEvents.SPEAK, { message: this.getTranslatedMessage('wait_msg', appSettings.language) });

        this.view.displayBotLoading();

        let content, followUp;

        let img = null;
        let placeholderImage = "../../img/generating.png";

        let vid = null;

        // This taskID is to store the ID of the created task from klingAI
        let taskID = null;
        
        // Detects if user has intention to generate an image/video
        // and adds in placeholder image
        if (this.isImageIntent(userInput)) {
            // Display a placeholder image with a unique messageId
            console.log('Detected Image generation intent');
            content = this.getTranslatedMessage('image_msg', appSettings.language)
            img = placeholderImage; 
        } else if (this.isVideoIntent(userInput)) {
            console.log('Detected Video generation intent');
            content = this.getTranslatedMessage('video_msg', appSettings.language)
            vid = 'video_placeholder';
        } else {
            ({ content, followUp } = await this.model.getBotResponse(userInput, llm_config.bot_language));
        }

        let messageContent = this.buildMessageContent({
            text: content ?? this.getTranslatedMessage('error_msg', appSettings.language),
            image: img,
            video: vid,
            followUp
        });

        const botMsgID = `msg-${Date.now()}`;
        this.model.addMessage("Bot", messageContent, botMsgID);
        this.view.displayMessage("Bot", messageContent, botMsgID);

        // Generate the image/video
        if (img != null) {
            taskID = await this.model.generateImage_KlingAI(userInput);
        } else if (vid != null) {
            taskID = await this.model.generateVideo_KlingAI(userInput);
        }

        // Repeatedly query for the task process
        let updateMsg = null;
        let result = null;      // To store the generated Images/Videos
        if (taskID != null) {
            try {
                result = await this.pollKlingAITask(botMsgID, taskID, {
                    intervalMs: 2000,
                    maxWaitMs: 120000
                });

                console.log('Resource generated successfully');
                updateMsg = this.getTranslatedMessage('success_image_msg', appSettings.language);
            } catch (err) {
                console.log('Resource failed to generate');
                updateMsg = this.getTranslatedMessage('failed_image_msg', appSettings.language);
            }

            // this.view.updateMessageImage(messageId, result, updateMsg);
            this.view.updateMessageContent(botMsgID, {
                text: updateMsg,
                image: result
            });

            EventBus.emit(AvatarEvents.SPEAK, { message: updateMsg });
        }

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

    isImageIntent(userMessage) {
        const message = userMessage.toLowerCase();
        return imageKeywords.some(keyword => message.includes(keyword));
    }

    isVideoIntent(userMessage) {
        const message = userMessage.toLowerCase();
        return videoKeywords.some(keyword => message.includes(keyword));
    }

    buildMessageContent({ text, image, video, file, followUp = [] }) {
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
    /**
     * Controller function to poll KlingAI task until it's done.
     * Returns image results once task completes.
     */
    async pollKlingAITask(messageID, taskID, options = {}) {

        console.log('Polling created KlingAI task: ' + taskID);
        const intervalMs = options.intervalMs || 3000;
        const maxWaitMs = options.maxWaitMs || 5 * 60 * 1000;

        let totalWait = 0;

        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const result = await this.model.queryTask_KlingAI(messageID, taskID);

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