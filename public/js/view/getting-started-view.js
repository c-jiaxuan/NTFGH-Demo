import { BaseView } from './base-view.js';

export class GettingStartedView extends BaseView {
    constructor(id)
    {
        super(id);
        this.buttons = {
            orientation : this.element.querySelector('#orientation-button'),
            assessment : this.element.querySelector('#assessment-button')
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