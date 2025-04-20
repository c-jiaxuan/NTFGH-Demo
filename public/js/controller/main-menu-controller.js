import { BasePageController } from './base-page-controller.js';
import { MainMenuView } from '../view/main-menu-view.js';
import { EventBus, Events } from '../event-bus.js';

export class MainMenuPageController extends BasePageController {
  constructor(id){
    const view = new MainMenuView(id);
    super(id, view);

    this.view.bindButtonClick(this.handleSubpageSwitch.bind(this));
  }

  handleSubpageSwitch(key) {
    switch (key){
      case "chat":
        break;
      case "gettingStarted":
        EventBus.emit(Events.GETTING_START_PRESS);
        break;
      case "delivery":
        EventBus.emit(Events.START_DELIVERY);
        break;
    }
  }

  onEnter() {
    super.onEnter();
    console.log('Main Menu page initialized');
    // Run animations, load data, start timers, etc.
  }

  onExit() {
    super.onExit();
    console.log('Leaving Main Menu page');
    // Cleanup, stop audio, etc.
  }
}