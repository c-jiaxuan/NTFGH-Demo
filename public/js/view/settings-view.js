import { EventBus, Events } from "../event-bus.js";
import { BaseView } from './base-view.js';

export class SettingsView extends BaseView {
    constructor(id)
    {
        super(id);
        this.langButtons = document.querySelectorAll('#lang-selector button');
        this.inputButtons = document.querySelectorAll('#input-selector button');

        this.init();
    }

    init()
    {
        // Function to handle selection of language
        this.langButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log("button-clicked");
                EventBus.emit(Events.UPDATE_LANGUAGE, button.innerText);
            });
        });
    
        // Function to handle selection of input method
        this.inputButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log("button-clicked");
                EventBus.emit(Events.UPDATE_INPUTMODE, button.innerText);
            });
        });
    }

    setCurrent(language, input){
        const allButtons = document.querySelectorAll('.action-button.settings');

        allButtons.forEach(btn => {
          const type = btn.dataset.type;
          const value = btn.dataset.value;
      
          // Clear previous highlights
          btn.classList.remove('selected');
      
          // Highlight based on default values
          if ((type === 'language' && value === language) ||
              (type === 'mode' && value === input)) {
            btn.classList.add('selected');
          }
        });
    }

    setLanguage(language) {
        const allButtons = document.querySelectorAll('.action-button.settings');

        allButtons.forEach(btn => {
          const type = btn.dataset.type;
          const value = btn.dataset.value;
      
          // Highlight based on default values
          if (type === 'language')
            {
              if(value === language)
                  btn.classList.add('selected');
              else
                  btn.classList.remove('selected');
            }
          });
    }

    setInput(input) {
        const allButtons = document.querySelectorAll('.action-button.settings');

        allButtons.forEach(btn => {
          const type = btn.dataset.type;
          const value = btn.dataset.value;
               
          // Highlight based on default values
          if (type === 'mode')
          {
            if(value === input)
                btn.classList.add('selected');
            else
                btn.classList.remove('selected');
          }
        });
    }
}