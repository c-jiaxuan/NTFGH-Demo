import { BasePageController } from './base-page-controller.js';
import { EventBus, Events } from '../event-bus.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';
import { appSettings } from '../appSettings.js';

export class ActionBarController extends BasePageController {
  constructor(id){
    const view = new ActionBarView(id);
    super(id, view);    

    this.actionChatbot = new ActionBarChatbot(this.view);

    this.countdownTimer = 1;
    this.isReadyForCommand = false;
    this.isAcknowledgedEmit = false;

    //Listen to view events
    this.view.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.view.on("acknowledgeCountdownComplete", (e) => {
        this.emit("acknowledged", {});
    });

    //Listen to global events
    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

  update(hasBackBtn=false, hasHelpBtn=false, hasAcknowledge = true)
  {
    this.view.showBackBtn(hasBackBtn);
    this.view.showHelpBtn(hasHelpBtn);
    this.view.showAcknowledgeBtn(hasAcknowledge);
  }

  enableAcknowledge(enabled){
    //Disable or enable button click
    this.view.enableAcknowledgeBtn(enabled);

    //TO-UPDATE-BETTER-LOGIC: Command detection only enable when user can click acknowledge
    this.isReadyForCommand = enabled;

    //transcribe for using voice input mode
    if(appSettings.inputMode == 'voice'){
      //Start or Stop detecting for keyword
      this.setupTranscribeForVoiceCommmand(enabled);
    }
  }

  setupTranscribeForVoiceCommmand(enabled){
    if(enabled)
    {
      console.log("action-bar: start listen for command");
      //Listen to transcribe event
      document.addEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Start transcribing
      document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
        detail: { language: appSettings.language, timeout: false }
      }));
    }
    else
    {
      console.log("action-bar: stop listen for command");
      //Remove transcribe listener
      document.removeEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Stop transcribing
      document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
        detail: { language: appSettings.language }
      }));
    }
  }

  countdownAcknowledgeBtn(isReady){
    this.view.countdownAcknowledgeBtn(this.countdownTimer, isReady);
  }

  handleActionBarClicked(key){
    //Upon any button clicked, disable the voice command detection
    if(appSettings.inputMode == 'voice') this.setupTranscribeForVoiceCommmand(false);

    this.emit("action-button-clicked", key);
  }

  handleTranscribeEvent(e){
    console.log("check action key" + e.detail);
    this.actionChatbot.handleTranscript(e.detail);
  }

  //Handle events for language and input mode 
  onUpdateLanguage(language){
    //update view to new language
    this.view.handleLanguageChange(language);
    //update command detection to new language
    this.actionChatbot.setLanguage(language);
  }

  onUpdateInputMode(inputMode){
    this.setupTranscribeForVoiceCommmand(inputMode == 'voice' && this.isReadyForCommand);
  }

  onEnter() {
    super.onEnter();

    //setup the chatbot upon show
    this.actionChatbot.setLanguage(appSettings.language);
  }

  onExit() {
    super.onExit();

    //Remove listener and stop transcribe in event of unnatural end of page
    this.setupTranscribeForVoiceCommmand(false);
  }
}