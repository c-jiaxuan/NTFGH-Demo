import { BasePageController } from './base-page-controller.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { DeliveryView } from '../view/delivery-view.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';

export class DeliverPageController extends BasePageController {
  constructor(id){
    const view = new DeliveryView(id);
    super(id, view);

    this.currentStep = 0;
    this.language = "en";
    this.inputMode = "voice";
    this.isTranscribeActive = false;

    this.view.bindButtonClick(this.handleItemSelection.bind(this));

    this.avatarSpeeches = [
      { message: "Please select the items for delivery.", gesture: "" },
      { message: "Your items are being delivered now.", gesture: "" },
      { message: "Your delivery has arrived. Thank you.", gesture: "" }      
    ];
    
    this.preloadCompleted = false;

    this.actionBar = new ActionBarView('bottom-action-bar');
    this.actionChatbot = new ActionBarChatbot(this.actionBar);
    
    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      this.nextStep();
    });

    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

    onUpdateLanguage(language){
      this.language = language;
      this.showCurrentStep();
    }
  
    onUpdateInputMode(mode){
      console.log(mode);
      this.inputMode = mode;
      this.showCurrentStep();
    }

  handleItemSelection(){
    this.actionBar.enableAcknowledgeBtn(true);

    if(this.inputMode == 'voice')
    {
      document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
        detail: { language: 'en-US', timeout: false }
      }));
      this.isTranscribeActive = true;
    }
  }

  handleActionBarClicked(key){
    if(!this.isActive) return;

    switch (key){
      case "back":
        if(this.inputMode == "voice"){
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }
        break;
      case "help":
        break;
      case "acknowledge":
        if(this.inputMode == "voice"){
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }
        this.actionBar.countdownAcknowledgeBtn(3, true);
        break;
    }
  }

  nextStep(){
    console.log('next');
    this.currentStep ++;
    this.showCurrentStep();   
  }

  showCurrentStep(){
    if(!this.isActive) return;

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
        }, 7000);

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

    if(this.currentStep != 3) EventBus.emit(AvatarEvents.SPEAK, this.avatarSpeeches[this.currentStep]);
  }

  handleTranscribeEvent(e){
    console.log("transcribe" + e.detail);
    this.actionChatbot.handleTranscript(e.detail);
  }

  onEnter() {
    super.onEnter();
    console.log('Delivery page initialized');
    // Run animations, load data, start timers, etc.
    this.currentStep = 0;

    this.showCurrentStep();
    this.actionBar.show();

    this.actionBar.showBackBtn(false);
    this.actionBar.showHelpBtn(false);
    this.actionBar.showAcknowledgeBtn(true);

    document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
    
    EventBus.emit(AvatarEvents.PRELOAD, { detail: this.avatarSpeeches } );
  }

  onExit() {
    super.onExit();
    console.log('Leaving Delivery page');
    // Cleanup, stop audio, etc.
    this.actionBar.hide();
    document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      detail: { language: 'en-US' }
    }));
    
    document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
  }
}