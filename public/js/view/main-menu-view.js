import { BaseView } from './base-view.js';

export class MainMenuView extends BaseView {

    constructor(id)
    {
        super(id);

        this.labels = {
            en: { 
                title: "Welcome to Panasonic", 
                guide: "What can i do for you today?", 
                chat: "Chat", 
                text2Img: "Image Generation", 
                text2Vid: "Video Generation",
                img2Vid: "Image-To-Video" },
            zh: {
                title: "欢迎来到松下",
                guide: "我今天可以为您做些什么？",
                chat: "聊天",
                text2Img: "图像生成",
                text2Vid: "视频生成",
                img2Vid: "图像转视频"}
        };

        this.buttons = {
            chat : this.element.querySelector('#chat-button'),
            text2Img : this.element.querySelector('#text2img-button'),
            text2Vid : this.element.querySelector('#text2vid-button'),
            img2Vid  : this.element.querySelector('#img2vid-button')
        }

        this.title = this.element.querySelector('#setup-title');
        this.guide = this.element.querySelector('.orientation-guide');
    }

    setLanguage(lang) {
        this.buttons.chat.querySelector('.button-text').textContent = this.labels[lang].chat;
        this.buttons.text2Img.querySelector('.button-text').textContent = this.labels[lang].text2Img;
        this.buttons.text2Vid.querySelector('.button-text').textContent = this.labels[lang].text2Vid;
        this.buttons.img2Vid.querySelector('.button-text').textContent = this.labels[lang].img2Vid;
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