import { BasePageController } from './base-page-controller.js';
import { SettingsView } from '../view/settings-view.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { EventBus, Events } from '../event-bus.js';

export class SettingsPageController extends BasePageController {
  constructor(id){
    const view = new SettingsView(id);
    super(id, view);

    this.actionBar = new ActionBarView('bottom-action-bar');

    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      this.nextStep();
    });

    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

  onUpdateLanguage(language){
    this.view.setLanguage(language == "English" ? "en" : "zh");
  }

  onUpdateInputMode(input){
    this.view.setInput(input.toLowerCase());
  }

  handleActionBarClicked(key){
    if(!this.isActive) return;
    
    switch (key){
      case "back":
        break;
      case "help":
        break;
      case "acknowledge":
        this.actionBar.countdownAcknowledgeBtn(1, true);
        break;
    }
  }

  nextStep() {
    EventBus.emit(Events.HOME_PRESS);
  }

  init(language, mode){
    this.view.setCurrent(language, mode);
  }

  onEnter() {
    super.onEnter();
    console.log('Settings page initialized');
    // Run animations, load data, start timers, etc.

    this.actionBar.show();
    this.actionBar.showBackBtn(false);
    this.actionBar.showHelpBtn(true);
    this.actionBar.showAcknowledgeBtn(true);
  }

  onExit() {
    super.onExit();
    console.log('Leaving Settings page');

    this.actionBar.hide();
    // Cleanup, stop audio, etc.
  }
}