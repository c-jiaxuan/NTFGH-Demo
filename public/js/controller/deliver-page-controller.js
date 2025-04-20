import { BasePageController } from './base-page-controller.js';
import { EventBus, Events } from '../event-bus.js';
import { DeliveryView } from '../view/delivery-view.js';
import { ActionBarView } from '../view/action-bar-view.js';

export class DeliverPageController extends BasePageController {
  constructor(id){
    const view = new DeliveryView(id);
    super(id, view);

    this.currentStep = 0;

    this.view.bindButtonClick(this.handleItemSelection.bind(this));
    
    this.actionBar = new ActionBarView('bottom-action-bar');
    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      this.nextStep();
    });
  }

  handleItemSelection(){
    this.actionBar.enableAcknowledgeBtn(true);
  }

  handleActionBarClicked(key){
    if(!this.isActive) return;

    switch (key){
      case "back":
        break;
      case "help":
        break;
      case "acknowledge":
        this.actionBar.countdownAcknowledgeBtn(3, true);
        break;
    }
  }

  nextStep(){
    console.log('next');
    this.currentStep ++;
    
    switch(this.currentStep){
      case 0:
        this.view.showSelection();
        break;
      case 1:
        this.view.showDelivering();
        this.actionBar.showBackBtn(false);
        this.actionBar.showAcknowledgeBtn(false);
        
        const deliveringInterval = setInterval(() => {
          this.nextStep();
          clearInterval(deliveringInterval);
        }, 3000);

        this.intervals.push(deliveringInterval);

        break;
      case 2:
        this.view.showDelivered();
        this.actionBar.showBackBtn(false);
        this.actionBar.showAcknowledgeBtn(true);
        break;
      case 3:
        EventBus.emit(Events.HOME_PRESS);
        break;
    }
  }

  onEnter() {
    super.onEnter();
    console.log('Delivery page initialized');
    // Run animations, load data, start timers, etc.
    this.currentStep = 0;

    this.view.showSelection();
    this.actionBar.show();

    this.actionBar.showBackBtn(false);
    this.actionBar.showHelpBtn(false);
    this.actionBar.showAcknowledgeBtn(true);
  }

  onExit() {
    super.onExit();
    console.log('Leaving Delivery page');
    // Cleanup, stop audio, etc.
    this.actionBar.hide();
  }
}