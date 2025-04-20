import { BaseView } from './base-view.js';

export class ActionBarView extends BaseView{
    constructor (id){
        super (id);

        this.buttons = {
            back : document.getElementById('back-button'),
            help : document.getElementById('help-button'),
            acknowledge: document.getElementById('acknowledge-button')
        }

        this.acknowledgeBtnTxt = this.buttons['acknowledge'].querySelector('.button-text');;
        this.acknowledgeBtnProgress = this.buttons['acknowledge'].querySelector('.overlay-progress');

        this.activeInterval = null;
    }

    show(){
        this.element.style.display = "flex";
    }

    showBackBtn(isOn) {
        if (this.buttons['back']) this.buttons['back'].style.visibility = isOn ? 'visible' : 'hidden';
    }

    showHelpBtn(isOn){
        if(this.buttons['help']) this.buttons['help'].style.visibility = isOn ? 'visible' : 'hidden';
    }

    showAcknowledgeBtn(isOn){
        if(this.buttons['acknowledge']) this.buttons['acknowledge'].style.visibility = isOn ? 'visible' : 'hidden';
    }

    enableAcknowledgeBtn(enabled){
        if(this.buttons['acknowledge']) this.buttons['acknowledge'].className = enabled ? 'action-button' : 'action-button-disabled';
    }

    bindButtonClick(callback) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.addEventListener('click', () => 
                {
                    callback(key);
                });
        });
    }

    //true = start. false = stop
    countdownAcknowledgeBtn(countdownTime, enabled){
        if(enabled){
            let elapsedMs = 0;
            const updateInterval = 50; // ms for smooth progress
            const totalMs = countdownTime * 1000;
            
            this.buttons['acknowledge'].className = "action-button-selected";
            this.acknowledgeBtnTxt.innerHTML = `Continue in ${countdownTime}s`;

            this.activeInterval = setInterval(() => {
                elapsedMs += updateInterval;
                const percent = (elapsedMs / totalMs) * 100;
                this.acknowledgeBtnProgress.style.width = `${percent}%`;

                const secondsLeft = Math.ceil((totalMs - elapsedMs) / 1000);
                if (secondsLeft > 0) {
                    this.acknowledgeBtnTxt.innerHTML = `Continue in ${secondsLeft}s`;
                } else {
                    this.countdownAcknowledgeBtn(5, false);
                    this.emit("acknowledgeCountdownComplete", {});
                }
            }, updateInterval);
        } else {
            if(this.activeInterval) 
            {
                clearInterval(this.activeInterval);
                this.activeInterval = null;
            }

            this.buttons['acknowledge'].className = "action-button";
            this.acknowledgeBtnTxt.innerHTML = `Acknowledge`;
            this.acknowledgeBtnProgress.style.width = '0%';
        }
    }
}