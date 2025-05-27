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

        this.setListeners();
        
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

    //
    // content is in JSON format
    //
    displayMessage(sender, content = {}) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender.toLowerCase());

        const bubble = document.createElement("span");

        if (content.image) {
            const img = document.createElement("img");
            img.src = content.image;
            img.classList.add("chat-image");
            bubble.appendChild(img);
        }

        if (content.video) {
            const video = document.createElement("video");
            video.src = content.video;
            video.controls = true;
            video.classList.add("chat-media");
            bubble.appendChild(video);
        }

        if (content.audio) {
            const audio = document.createElement("audio");
            audio.src = content.audio;
            audio.controls = true;
            audio.classList.add("chat-media");
            bubble.appendChild(audio);
        }

        if (content.file) {
            const fileLink = document.createElement("a");
            fileLink.href = content.file;
            fileLink.textContent = "📎 Download File";
            fileLink.classList.add("chat-file");
            bubble.appendChild(fileLink);
        }

        if (content.text) {
            const text = document.createElement("div");
            text.classList.add("chat-text");
            text.innerHTML = marked.parse(content.text);
            bubble.appendChild(text);
        }

        if (content.buttons) {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("chat-buttons");

            // Add listening logic inside
            content.buttons.forEach((btn) => {
                const button = document.createElement("button");
                button.textContent = btn.label;
                button.classList.add("chat-button");
                button.onclick = () => {
                    this.handleUserInput(btn.label);
                };
                buttonContainer.appendChild(button);
            });
            bubble.appendChild(buttonContainer);
        }

        const timestamp = document.createElement("div");
        timestamp.className = "message-time";
        timestamp.textContent = new Date().toLocaleString();

        messageElement.appendChild(bubble);
        messageElement.appendChild(timestamp);
        this.chatLog.appendChild(messageElement);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
    }

    setUserInputHandler(handler) {
        this.handleUserInput = handler;
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

    // For popping up images from within chat bubble
    setListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('popupImage');
            const closeBtn = modal.querySelector('.close-btn');

            document.body.addEventListener('click', (e) => {
                if (e.target.classList.contains('chat-image')) {
                modalImg.src = e.target.src;
                modal.classList.remove('hidden');
                }
            });

            closeBtn.onclick = () => {
                modal.classList.add('hidden');
                modalImg.src = '';
            };
        });
    }
}