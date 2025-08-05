import { BasePageController } from './base-page-controller.js';
import { EventBus, Events } from '../event-bus.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';
import { appSettings } from '../config/appSettings.js';

export class ActionBarController extends BasePageController {
  constructor(id) {
    const view = new ActionBarView(id);
    super(id, view);

    this.actionChatbot = new ActionBarChatbot(view);
    this.countdownTimer = 1;
    this.isReadyForCommand = false;

    // clicks
    view.bindButtonClick(this.handleActionBarClicked.bind(this));

    // both countdown-complete hooks
    view.on("acknowledgeCountdownComplete", () => this.emit("acknowledged", {}));
    view.on("generateCountdownComplete",    () => this.emit("generate",     {}));

    // global settings
    EventBus.on(Events.UPDATE_LANGUAGE,  e => this.onUpdateLanguage(e.detail));
    EventBus.on(Events.UPDATE_INPUTMODE, e => this.onUpdateInputMode(e.detail));
  }

  update(hasBack=false, hasHelp=false, hasAck=true, hasGen=false) {
    this.view.showBackBtn(hasBack);
    this.view.showHelpBtn(hasHelp);
    this.view.showAcknowledgeBtn(hasAck);
    this.view.showGenerateBtn(hasGen);
  }

  enableAcknowledge(enabled){
    //Disable or enable button click
    this.view.enableAcknowledgeBtn(enabled);

    //TO-UPDATE-BETTER-LOGIC: Command detection only enable when user can click acknowledge
    this.isReadyForCommand = enabled;

    console.log('[action-bar-controller] action-bar: ' + enabled);

    //transcribe for using voice input mode
    if(appSettings.inputMode == 'voice'){
      console.log('[action-bar-controller] action-bar: ' + enabled);
      //Start or Stop detecting for keyword
      this.setupTranscribeForVoiceCommmand(enabled);
    }
  }

  enableGenerate(enabled) {
    this.view.enableGenerateBtn(enabled);

    //TO-UPDATE-BETTER-LOGIC: Command detection only enable when user can click acknowledge
    this.isReadyForCommand = enabled;

    console.log('[action-bar-controller] action-bar: ' + enabled);

    //transcribe for using voice input mode
    if(appSettings.inputMode == 'voice'){
      console.log('[action-bar-controller] action-bar: ' + enabled);
      //Start or Stop detecting for keyword
      this.setupTranscribeForVoiceCommmand(enabled);
    }
  }

  setupTranscribeForVoiceCommmand(enabled){
    if(enabled)
    {
      console.log("[action-bar-controller] action-bar: start listen for command");
      //Listen to transcribe event
      document.addEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Start transcribing
      document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
        detail: {  }
      }));
    }
    else
    {
      console.log("[action-bar-controller] action-bar: stop listen for command");
      //Remove transcribe listener
      document.removeEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Stop transcribing
      // document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      //   detail: { language: appSettings.language }
      // }));
      document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
        detail: { }
      }));
    }
  }

  countdownAcknowledgeBtn(isReady){
    this.view.countdownAcknowledgeBtn(this.countdownTimer, isReady);
  }

  countdownGenerateBtn(isReady) {
    this.view.countdownGenerateBtn(this.countdownTimer, isReady);
  }

  handleActionBarClicked(key){
    //Upon any button clicked, disable the voice command detection
    if(appSettings.inputMode == 'voice') 
    {
      this.setupTranscribeForVoiceCommmand(false);
    }

    this.emit("action-button-clicked", key);
  }

  handleTranscribeEvent(e){
    console.log("[action-bar-controller] check action key" + e.detail);
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