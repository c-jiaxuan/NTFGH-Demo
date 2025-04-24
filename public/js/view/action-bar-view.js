import { BaseView } from './base-view.js';

// 💬 Language options embedded in the same file
const languageOptions = {
    en: {
        label: "English",
        icon: "./img/icon/lang_en.png",
        homeLabel: "Home",
        inputModeLabels: { touch: "Touch", voice: "Voice" },
        actionBarLabels: {
            back: "Back",
            help: "Help",
            acknowledge: "Acknowledge",
            countdown: (s) => `Continue in ${s}s`
        }
    },
    zh: {
        label: "中文",
        icon: "./img/icon/lang_zh.png",
        homeLabel: "主页",
        inputModeLabels: { touch: "触控", voice: "语音" },
        actionBarLabels: {
            back: "返回",
            help: "帮助",
            acknowledge: "确认",
            countdown: (s) => `${s}秒后继续`
        }
    }
};

export class ActionBarView extends BaseView {
    constructor(id) {
        super(id);

        this.buttons = {
            back: document.getElementById('back-button'),
            help: document.getElementById('help-button'),
            acknowledge: document.getElementById('acknowledge-button')
        };

        this.acknowledgeBtnTxt = this.buttons['acknowledge'].querySelector('.button-text');
        this.acknowledgeBtnProgress = this.buttons['acknowledge'].querySelector('.overlay-progress');

        this.currentLangLabels = languageOptions.en.actionBarLabels;
        this.activeInterval = null;
    }

    show() {
        this.element.style.display = "flex";
    }

    showBackBtn(isOn) {
        if (this.buttons['back']) {
            this.buttons['back'].style.visibility = isOn ? 'visible' : 'hidden';
        }
    }

    showHelpBtn(isOn) {
        if (this.buttons['help']) {
            this.buttons['help'].style.visibility = isOn ? 'visible' : 'hidden';
        }
    }

    showAcknowledgeBtn(isOn) {
        if (this.buttons['acknowledge']) {
            this.buttons['acknowledge'].style.visibility = isOn ? 'visible' : 'hidden';
        }
    }

    enableAcknowledgeBtn(enabled) {
        if (this.buttons['acknowledge']) {
            this.buttons['acknowledge'].className = enabled ? 'action-button' : 'action-button-disabled';
        }
    }

    bindButtonClick(callback) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.addEventListener('click', () => {
                callback(key);
            });
        });
    }

    countdownAcknowledgeBtn(countdownTime, enabled) {
        if (enabled) {
            // Clear any previously running countdown
            if (this.activeInterval) {
                clearInterval(this.activeInterval);
                this.activeInterval = null;
            }
        
            let elapsedMs = 0;
            const updateInterval = 50;
            const totalMs = countdownTime * 1000;
        
            this.buttons['acknowledge'].className = "action-button-selected";
            this.acknowledgeBtnTxt.innerHTML = this.currentLangLabels.countdown(countdownTime);
        
            this.activeInterval = setInterval(() => {
                elapsedMs += updateInterval;
                const percent = (elapsedMs / totalMs) * 100;
                this.acknowledgeBtnProgress.style.width = `${percent}%`;
        
                const secondsLeft = Math.ceil((totalMs - elapsedMs) / 1000);
                if (secondsLeft > 0) {
                    this.acknowledgeBtnTxt.innerHTML = this.currentLangLabels.countdown(secondsLeft);
                } else {
                    if (this.activeInterval) {
                        clearInterval(this.activeInterval);
                        this.activeInterval = null;
                    }
        
                    this.buttons['acknowledge'].className = "action-button";
                    this.acknowledgeBtnTxt.innerHTML = this.currentLangLabels.acknowledge;
                    this.acknowledgeBtnProgress.style.width = '0%';
        
                    this.emit("acknowledgeCountdownComplete", {});
                }
            }, updateInterval);
        } else {
            if (this.activeInterval) {
                clearInterval(this.activeInterval);
                this.activeInterval = null;
            }

            this.buttons['acknowledge'].className = "action-button";
            this.acknowledgeBtnTxt.innerHTML = this.currentLangLabels.acknowledge;
            this.acknowledgeBtnProgress.style.width = '0%';
        }
    }

    updateLanguageLabels(langLabels) {
        this.currentLangLabels = langLabels;

        if (this.buttons['back']) {
            const backText = this.buttons['back'].querySelector('.button-text');
            if (backText) backText.innerHTML = langLabels.back;
        }

        if (this.buttons['help']) {
            const helpText = this.buttons['help'].querySelector('.button-text');
            if (helpText) helpText.innerHTML = langLabels.help;
        }

        if (this.buttons['acknowledge']) {
            const ackText = this.buttons['acknowledge'].querySelector('.button-text');
            if (ackText) ackText.innerHTML = langLabels.acknowledge;
        }
    }

    handleLanguageChange(language) {
        const langData = languageOptions[language];
        if (langData && langData.actionBarLabels) {
            this.updateLanguageLabels(langData.actionBarLabels);
        }
    }
}
