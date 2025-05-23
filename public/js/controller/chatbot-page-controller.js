import { BasePageController } from './base-page-controller.js';
import { ChatbotView } from '../view/chatbot-view.js';
import { ChatModel } from '../model/chat-model.js';
import { chatbot_config } from "../model/chatbot-config.js";
import { EventBus, Events } from '../event-bus.js';
import { appSettings } from '../appSettings.js';

export class ChatbotPageController extends BasePageController {
    constructor(id){
        const view = new ChatbotView(id);
        const model = new ChatModel();
        super(id, view, model);
    
        this.view.setLanguage(appSettings.language);
    
        this.view.bindSend(this.handleSend.bind(this));
    
        EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
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
        this.model.addMessage("User", userInput);
        this.view.displayMessage("User", userInput);

        // Show typing/loading bubble
        this.view.displayBotLoading();

        // Wait for LLM reply
        const botText = await this.model.getBotResponse(userInput);

        // Remove loading
        this.view.removeBotLoading();

        // Show actual bot response
        this.view.displayMessage("Bot", botText);
    }


    onEnter() {
        super.onEnter();
        
        console.log('Chatbot page initialized');

        //Listen to global events
        EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
        EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
    }

    onExit() {
        super.onExit();

        console.log('Leaving Chatbot page');
    }

    start() {
        const welcomeMsg = this.getTranslatedMessage('start_msg', 'en'); // or 'zh'
        this.model.addMessage("Bot", welcomeMsg);
        this.view.displayMessage("Bot", welcomeMsg);
    }

    onUpdateLanguage(language) {
        console.log('Chatbot language changed to ' + language);
    }

    onUpdateInputMode(input) {
        console.log('Chatbot input mode changed to ' + input);
    }

    getTranslatedMessage(title, lang = 'en') {
        const item = chatbot_config.find(msg => msg.title === title);
        return item?.translations?.[lang] || '';
    }
}