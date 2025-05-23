import { BaseView } from './base-view.js';

export class ChatbotView extends BaseView {

    constructor(id)
    {
        super(id);
        // this.buttons = {
        //     chat : this.element.querySelector('#chat-button'),
        //     gettingStarted : this.element.querySelector('#getting-started-button'),
        //     delivery : this.element.querySelector('#delivery-button')
        // }

        // this.title = this.element.querySelector('#setup-title');
        // this.guide = this.element.querySelector('.orientation-guide');

        // Set up button linkage
        // Chat history
        // Bot and user bubble
        // Text input box, input settings

        this.chatLog = document.getElementById("chat-log");
        this.chatInput = document.getElementById("chat-input");
        this.sendButton = document.getElementById("send-button");
        
    }

    bindSend(handler) {
        this.sendButton.addEventListener("click", () => {
            console.log('Chatbot send enter button input');
            const text = this.chatInput.value.trim();
            if (text) {
                handler(text);
                this.chatInput.value = "";
            }
        });

        this.chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                console.log('Chatbot send enter keypress input');
                this.sendButton.click();
            }
        });
    }

    displayMessage(sender, text) {
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add("message", sender.toLowerCase());

        const bubble = document.createElement("span");
        bubble.textContent = text;

        const timestamp = document.createElement("div");
        timestamp.className = "message-time";
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString();
        timestamp.textContent = `${date} ${time}`;


        messageWrapper.appendChild(bubble);
        messageWrapper.appendChild(timestamp);

        this.chatLog.appendChild(messageWrapper);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
    }

    displayBotLoading() {
        // Create placeholder bot message
        this.loadingElement = document.createElement("div");
        this.loadingElement.classList.add("message", "bot");

        const bubble = document.createElement("span");
        bubble.textContent = "Typing...";

        const timestamp = document.createElement("div");
        timestamp.className = "message-time";
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.loadingElement.appendChild(bubble);
        this.loadingElement.appendChild(timestamp);
        this.chatLog.appendChild(this.loadingElement);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
    }

    removeBotLoading() {
        if (this.loadingElement) {
            this.chatLog.removeChild(this.loadingElement);
            this.loadingElement = null;
        }
    }


    setLanguage(language) {
        console.log('Setting Language: ' + language);
    }
}