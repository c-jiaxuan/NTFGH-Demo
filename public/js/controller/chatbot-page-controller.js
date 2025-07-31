import { BasePageController } from './base-page-controller.js';
import { ChatbotView } from '../view/chatbot-view.js';
import { ChatModel } from '../model/chat-model.js';
import { chatbot_config, messageIntent, imageKeywords, img2VidKeywords, videoKeywords } from "../config/chatbot-config.js";
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

        this.view.bindFileSelect(this.handleFileUpload.bind(this));

        this.isTranscribeActive = false;
    }

    async handleSend(userInput) {
        const uploadedFile = this.model.getUploadedFile(); 
        const messageId = this.createMessageId();
        this.addUserMessage( { text: userInput, image: uploadedFile }, messageId);

        EventBus.emit(AvatarEvents.SPEAK, {
            message: this.getTranslatedMessage('wait_msg', appSettings.language)
        });

        this.view.displayBotLoading();

        const intent = this.detectIntent(userInput);
        const placeholder = this.getPlaceholder(intent);

        let botResponse = await this.getBotResponse(userInput, intent, placeholder);
        const botMsgID = this.createMessageId();

        this.addBotMessage(botResponse, botMsgID, intent);

        if (intent !== messageIntent.NONE) {
            console.log('[chat-controller] uploadedFile =  ' + uploadedFile);
            if (uploadedFile !== null) {
                await this.handleMediaGeneration(userInput, intent, botMsgID, uploadedFile);
                this.model.clearUploadedFile();

                // Give the DOM some time to update before clearing
                setTimeout(() => {
                    this.view.clearUploadedMediaPreview();
                    this.view.clearFileInput();
                    console.log('[chat-controller] Uploaded media preview cleared after sending.');
                }, 50);
            } else {
                await this.handleMediaGeneration(userInput, intent, botMsgID);
           }
        }

        EventBus.emit(AvatarEvents.SPEAK, { message: botResponse.text });
        this.view.removeBotLoading();
    }

    createMessageId() {
        return `msg-${Date.now()}`;
    }

    addUserMessage(content, messageId) {
        this.model.addMessage("User", content, messageId);
        this.view.displayMessage("User", content);
    }

    // KEYWORDS ARE OVERLAPPING !!! NEED TO CHANGE
    detectIntent(userInput) {
        if (this.isImageIntent(userInput)) return messageIntent.TXT2IMG;
        if (this.isVideoIntent(userInput)) return messageIntent.TXT2VID;
        if (this.isImg2VideoIntent(userInput)) return messageIntent.IMG2VID;
        return messageIntent.NONE;
    }

    getPlaceholder(intent) {
        if (intent === messageIntent.TXT2IMG) return "../../img/generating.png";
        if (intent === messageIntent.TXT2VID || intent === messageIntent.IMG2VID) return 'video_placeholder';
        return null;
    }

    async getBotResponse(userInput, intent, placeholder) {
        let content, followUp = null;

        switch (intent) {
            case messageIntent.TXT2IMG:
                content = this.getTranslatedMessage('image_msg', appSettings.language);
                break;
            case messageIntent.TXT2VID:
            case messageIntent.IMG2VID:
                content = this.getTranslatedMessage('video_msg', appSettings.language);
                break;
            case messageIntent.NONE:
                ({ content, followUp } = await this.model.getBotResponse(userInput, llm_config.bot_language));
                break;
            default:
                ({ content, followUp } = await this.model.getBotResponse(userInput, llm_config.bot_language));
                break;
        }

        return this.buildMessageContent({
            text: content ?? this.getTranslatedMessage('error_msg', appSettings.language),
            image: intent === messageIntent.TXT2IMG ? placeholder : null,
            video: (intent === messageIntent.TXT2VID || intent === messageIntent.IMG2VID) ? placeholder : null,
            followUp
        });
    }

    addBotMessage(messageContent, messageId, intent = messageIntent.NONE) {
        this.model.addMessage("Bot", messageContent, messageId, intent);
        this.view.displayMessage("Bot", messageContent, messageId);
    }

    async handleMediaGeneration(userInput, intent, messageId, image = null) {
        let taskID = null;

        try {
            if (intent === messageIntent.TXT2IMG) {
                taskID = await this.model.generateImage_KlingAI(userInput);
            } else if (intent === messageIntent.TXT2VID) {
                taskID = await this.model.generateVideo_KlingAI(userInput);
            } else if (intent === messageIntent.IMG2VID) {
                taskID = await this.model.generateImg2Video_KlingAI(userInput, image);
            }

            const result = await this.pollKlingAITask(messageId, taskID, {
                intervalMs: 2000,
                maxWaitMs: 1200000
            });

            const updateMsg = result
                ? this.getTranslatedMessage('success_image_msg', appSettings.language)
                : this.getTranslatedMessage('failed_image_msg', appSettings.language);

            if (result) {
                this.view.updateMessageContent(messageId, {
                    text: 'Here is your generated content:',
                    image: result.type === 'image' ? result.urls : null,
                    video: result.type === 'video' ? result.urls : null
                });
            }

            EventBus.emit(AvatarEvents.SPEAK, { message: updateMsg });
        } catch (err) {
            const failMsg = this.getTranslatedMessage('failed_image_msg', appSettings.language);
            EventBus.emit(AvatarEvents.SPEAK, { message: failMsg });
            console.warn('[chat-controller] Media generation failed', err);
        }
    }

    async handleFileUpload(file) {
        try {
            const base64Img = await this.model.convertToBase64Img(file);
            const base64Only = base64Img.replace(/^data:image\/\w+;base64,/, '');

            console.log('[chat-controller] Uploaded file in base64 is =', base64Only);

            const type = this.model.getUploadedFileType();

            this.view.renderUploadedMedia(base64Only, type, () => {
                this.model.clearUploadedFile();
                console.log('[chat-controller] File deleted, model cleared.');
            });

        } catch (error) {
            console.error('[chat-controller] Failed to convert image to base64:', error);
        }
    }

    onEnter() {
        super.onEnter();
        
        console.log('[chat-controller] Chatbot page initialized');

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

        console.log('[chat-controller] Leaving Chatbot page');

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
        console.log('[chat-controller] Chatbot page start');

        const welcomeMsg = this.getTranslatedMessage('start_msg', appSettings.language); // or 'zh'

        EventBus.emit(AvatarEvents.SPEAK, { message: welcomeMsg } );

        this.model.addMessage("Bot", { text: welcomeMsg });
        this.view.displayMessage("Bot", { text: welcomeMsg });
    }

    onUpdateLanguage(language) {
        console.log('[chat-controller] Chatbot language changed to ' + language);
    }

    onUpdateInputMode(input) {
        console.log('[chat-controller] Chatbot input mode changed to ' + input);

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
        console.log("[chat-controller] transcribe" + e.detail);
    }

    async handleTranscribeComplete(e) {
        const transcript = this.normalize(e.detail);
        if(transcript == "") {
            return;
        }
        
        console.log("[chat-controller] transcribe complete = " + transcript);
        
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

    isImg2VideoIntent(userMessage) {
        const message = userMessage.toLowerCase();
        return img2VidKeywords.some(keyword => message.includes(keyword));
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

        if (followUp && followUp.length > 0) {
            messageContent.buttons = followUp.map((label, index) => ({
                label,
                value: `option_${index}`
            }));
        }

        console.log('[chat-controller] built messageContent: ' + JSON.stringify(messageContent));
        return messageContent;
    }
    /**
     * Controller function to poll KlingAI task until it's done.
     * Returns image results once task completes.
     */
    async pollKlingAITask(messageID, taskID, options = {}) {

        console.log('[chat-controller] Polling created KlingAI task: ' + taskID);
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