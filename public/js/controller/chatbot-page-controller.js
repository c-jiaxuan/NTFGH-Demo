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
        // Show user message
        this.model.addMessage("User", { text: userInput });
        this.view.displayMessage("User", { text: userInput });

        EventBus.emit(AvatarEvents.SPEAK, { message: this.getTranslatedMessage('wait_msg', appSettings.language) });

        // Show typing/loading bubble
        this.view.displayBotLoading();

        // Wait for LLM reply
        const { content, followUp } = await this.model.getBotResponse(userInput, llm_config.bot_language);

        if (content === null) {
            content = this.getTranslatedMessage('error_msg', appSettings.language);
        }

        EventBus.emit(AvatarEvents.SPEAK, { message: content } );

        // Map followUp items to button objects
        var buttons = followUp.map((label, index) => ({
            label: label,
            value: `option_${index}` // You can customize this value as needed
        }));

        var messageContent = {
            text: content,
            image: "../../img/mri_scan.png",
            buttons: buttons
        }

        // Remove loading
        this.view.removeBotLoading();

        // Show actual bot response
        this.view.displayMessage("Bot", messageContent);
    }

    onEnter() {
        super.onEnter();
        
        console.log('Chatbot page initialized');

        //Listen to global events
        EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
        EventBus.on(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })

        // EventBus.emit(AvatarEvents.PRELOAD, { detail: speechTexts });
    }

    onExit() {
        super.onExit();

        console.log('Leaving Chatbot page');

        EventBus.off(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.off(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
        EventBus.off(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })
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
    }

    getTranslatedMessage(title, lang = 'en') {
        return chatbot_config[title]?.[lang] || '';
    }

    onAvatarSpeakCompleted(e) {
        
    }
}