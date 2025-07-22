import { BaseView } from './base-view.js';

export class ChatbotView extends BaseView {

    constructor(id)
    {
        super(id);

        this.chatLog = document.getElementById("chat-log");
        this.chatInput = document.getElementById("chat-input");
        this.sendButton = document.getElementById("send-button");
        this.attachButton = document.getElementById("attach-button");
        this.fileInput = document.getElementById("fileInput");

        this.setListeners();
    }

    bindSend(handler) {
        this.sendButton.addEventListener("click", () => {
            console.log('[chat-view] Chatbot send enter button input');
            const text = this.chatInput.value.trim();
            if (text) {
                handler(text);
                this.chatInput.value = "";
            }
        });

        this.chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                console.log('[chat-view] Chatbot send enter keypress input');
                this.sendButton.click();
            }
        });
    }

    bindFileSelect(handler) {
        document.getElementById("fileInput").addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('[chat-view] fileName = ' + file.name);
                handler(file);
            } else {
                console.log('[chat-view] No file selected.');
            }
        });

        this.attachButton.addEventListener('click', function() {
            document.getElementById("fileInput").click();
        });
    }

    //
    // content is in JSON format
    //
    displayMessage(sender, content = {}, messageId = null) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender.toLowerCase());

        if (messageId) {
            messageElement.dataset.messageId = messageId;
        }
        
        const bubble = document.createElement("span");

        if (content.text) {
            const text = document.createElement("div");
            text.classList.add("chat-text");
            text.innerHTML = marked.parse(content.text);
            bubble.appendChild(text);
        }

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

        if (content.file) {
            const fileLink = document.createElement("a");
            fileLink.href = content.file;
            fileLink.textContent = "📎 Download File";
            fileLink.classList.add("chat-file");
            bubble.appendChild(fileLink);
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
        this.chatLog.scrollTo({ top: this.chatLog.scrollHeight, behavior: 'smooth' });
    }

    updateMessageContent(messageId, updates = {}) {
        const messageElement = this.chatLog.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;

        const bubble = messageElement.querySelector("span");

        if (updates.text !== undefined) {
            let textElement = bubble.querySelector(".chat-text");
            if (!textElement && updates.text) {
                textElement = document.createElement("div");
                textElement.classList.add("chat-text");
                bubble.prepend(textElement);
            }
            if (textElement) {
                textElement.innerHTML = marked.parse(updates.text);
            }
        }

        if (updates.image !== undefined) {
            let imgElement = bubble.querySelector("img.chat-image");
            if (!imgElement && updates.image) {
                imgElement = document.createElement("img");
                imgElement.classList.add("chat-image");
                bubble.appendChild(imgElement);
            }
            if (imgElement) {
                imgElement.src = updates.image;
            }
        }

        if (updates.video !== undefined) {
            let videoElement = bubble.querySelector("video.chat-media");
            if (!videoElement && updates.video) {
                videoElement = document.createElement("video");
                videoElement.controls = true;
                videoElement.classList.add("chat-media");
                bubble.appendChild(videoElement);
            }
            if (videoElement) {
                videoElement.src = updates.video;
            }
        }

        if (updates.file !== undefined) {
            let fileLink = bubble.querySelector("a.chat-file");
            if (!fileLink && updates.file) {
                fileLink = document.createElement("a");
                fileLink.classList.add("chat-file");
                fileLink.textContent = "📎 Download File";
                bubble.appendChild(fileLink);
            }
            if (fileLink) {
                fileLink.href = updates.file;
            }
        }

        if (updates.buttons !== undefined) {
            let buttonContainer = bubble.querySelector(".chat-buttons");
            if (buttonContainer) {
                buttonContainer.remove(); // clear old buttons
            }
            if (updates.buttons && updates.buttons.length) {
                buttonContainer = document.createElement("div");
                buttonContainer.classList.add("chat-buttons");

                updates.buttons.forEach((btn) => {
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
        }

        this.chatLog.scrollTo({ top: this.chatLog.scrollHeight, behavior: 'smooth' });
    }

    // To update the image in a chat bubble once the image is generated
    updateMessageImage(messageId, newImageSrc, newText = null) {
        const messageElement = this.chatLog.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;

        // Update image source
        const img = messageElement.querySelector("img.chat-image");
        if (img && newImageSrc) {
            img.src = newImageSrc;
        }

        // Update text content (if provided)
        this.updateMessageText(messageIdnewText);
    }

    updateMessageText(messageId, newText) {
        const messageElement = this.chatLog.querySelector(`[data-message-id="${messageId}"]`);
        if (!messageElement) return;
        
        if (newText !== null) {
            const textElement = messageElement.querySelector(".chat-text");
            if (textElement) {
                textElement.innerHTML = marked.parse(newText); // assumes markdown support
            } else {
                // Create a new text element if it doesn't exist
                const newTextElement = document.createElement("div");
                newTextElement.classList.add("chat-text");
                newTextElement.innerHTML = marked.parse(newText);
                const bubble = messageElement.querySelector("span");
                if (bubble) bubble.appendChild(newTextElement);
            }
        }
    }

    renderUploadedMedia(base64, type, onDelete) {
        const previewArea = document.querySelector('#upload-preview-area');

        // Clear previous preview
        previewArea.innerHTML = '';

        // Create new container
        const container = document.createElement('div');
        container.className = 'uploaded-media-container';

        let mediaElement;
        if (type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = `data:image/*;base64,${base64}`;
        } else if (type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = `data:video/mp4;base64,${base64}`;
            mediaElement.controls = true;
        }

        mediaElement.className = 'uploaded-preview';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-upload-btn';
        deleteBtn.onclick = () => {
            container.remove();
            onDelete(); // callback to controller to clear the model
        };

        container.appendChild(mediaElement);
        container.appendChild(deleteBtn);
        previewArea.appendChild(container);
    }

    clearUploadedMediaPreview() {
        const previewArea = document.querySelector('#upload-preview-area');
        if (previewArea) {
            console.log('[chat-view] Cleared upload preview area');
            previewArea.innerHTML = '';
        }
    }

    clearFileInput() {
        if (this.fileInput) {
            this.fileInput.value = '';
            console.log('[chat-view] Cleared file input');
        }
    }

    setUserInputHandler(handler) {
        this.handleUserInput = handler;
    }

    setTranscribeInput(input) {
        this.chatInput.value = input;
    }

    displayBotLoading() {
        // Create placeholder bot message
        this.loadingElement = document.createElement("div");
        this.loadingElement.classList.add("message", "bot");

        const bubble = document.createElement("span");
        bubble.textContent = "Processing...";

        const timestamp = document.createElement("div");
        timestamp.className = "message-time";
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.loadingElement.appendChild(bubble);
        this.loadingElement.appendChild(timestamp);
        this.chatLog.appendChild(this.loadingElement);
        this.chatLog.scrollTop = this.chatLog.scrollHeight;
        this.chatLog.scrollTo({ top: this.chatLog.scrollHeight, behavior: 'smooth' });
    }

    removeBotLoading() {
        if (this.loadingElement) {
            this.chatLog.removeChild(this.loadingElement);
            this.loadingElement = null;
        }
    }

    setLanguage(language) {
        console.log('[chat-view] Setting Language: ' + language);
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

            this.chatInput.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }
}