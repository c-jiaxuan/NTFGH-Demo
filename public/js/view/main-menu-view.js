import { BaseView } from './base-view.js';

export class MainMenuView extends BaseView {

    constructor(id)
    {
        super(id);

        this.labels = {
            en: { 
                title: "Welcome", 
                guide: "What can i do for you today?", 
                chat: "Chat", 
                gettingStarted: "Getting Started", 
                delivery: "Delivery" },
            zh: {
                title: "欢迎",
                guide: "我今天可以为您做些什么？",
                chat: "聊天",
                gettingStarted: "入门指南",
                delivery: "送货服务"
              }
        };

        this.buttons = {
            chat : this.element.querySelector('#chat-button'),
            gettingStarted : this.element.querySelector('#getting-started-button'),
            delivery : this.element.querySelector('#delivery-button')
        }

        this.title = this.element.querySelector('#setup-title');
        this.guide = this.element.querySelector('.orientation-guide');
    }

    setLanguage(lang) {
        this.buttons.chat.querySelector('.button-text').textContent = this.labels[lang].chat;
        this.buttons.gettingStarted.querySelector('.button-text').textContent = this.labels[lang].gettingStarted;
        this.buttons.delivery.querySelector('.button-text').textContent = this.labels[lang].delivery;
        this.title.textContent = this.labels[lang].title;
        this.guide.textContent = this.labels[lang].guide;
    }

    bindButtonClick(callback) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.addEventListener('click', () => 
                {
                    callback(key);
                });
    });
  }
}