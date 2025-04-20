import { BasePageController } from './base-page-controller.js';
import { GettingStartedView } from '../view/getting-started-view.js';
import { EventBus, Events } from '../event-bus.js';

export class GettingStartedPageController extends BasePageController {
  constructor(id){
    const view = new GettingStartedView(id);
    super(id, view);

    this.view.bindButtonClick(this.handleSubpageSwitch.bind(this));
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
  }

  onExit() {
    super.onExit();
    console.log('Leaving Getting Started page');
    // Cleanup, stop audio, etc.
  }
}