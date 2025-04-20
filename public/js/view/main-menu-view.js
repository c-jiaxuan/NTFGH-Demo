import { BaseView } from './base-view.js';

export class MainMenuView extends BaseView {

    constructor(id)
    {
        super(id);

        this.buttons = {
            chat : this.element.querySelector('#chat-button'),
            gettingStarted : this.element.querySelector('#getting-started-button'),
            delivery : this.element.querySelector('#delivery-button')
        }
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