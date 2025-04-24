import { BasePageController } from './base-page-controller.js';
import { GettingStartedView } from '../view/getting-started-view.js';
import { EventBus, Events } from '../event-bus.js';
import { appSettings } from '../appSettings.js';

export class GettingStartedPageController extends BasePageController {
  constructor(id){
    const view = new GettingStartedView(id);
    super(id, view);

    this.view.setLanguage(appSettings.language);

    this.view.bindButtonClick(this.handleSubpageSwitch.bind(this));

    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
  }

  //Handle events for language and input mode 
  onUpdateLanguage(language){
    //update view to new language
    this.view.setLanguage(language);
  }
  
  handleSubpageSwitch(key) {
    switch (key){
      case "orientation":
        EventBus.emit(Events.START_ORIENTATION);
        break;
      case "assessment":
        EventBus.emit(Events.START_PATIENT_ASSESSMENT);
        break;
    }
  }

  onEnter() {
    super.onEnter();
    console.log('Getting Started page initialized');
    // Run animations, load data, start timers, etc.
    this.view.setLanguage(appSettings.language);
  }

  onExit() {
    super.onExit();
    console.log('Leaving Getting Started page');
    // Cleanup, stop audio, etc.
  }
}