import { BasePageController } from './base-page-controller.js';
import { EventBus, Events } from '../event-bus.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';

export class ActionBarController extends BasePageController {
  constructor(id){
    const view = new ActionBarView(id);
    super(id, view);

    this.actionChatbot = new ActionBarChatbot(this.view);

    this.view.on("readyForAcknowledge", (e) => {
      this.onStepReadyForAcknowledge(e.detail);
    });

    this.view.on("quizAnswered", (e) => {
      this.onQuizAnswered(e.detail);
    })

    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      this.nextStep();
    });
  }


  handleTranscribeEvent(e){
    console.log("check action key" + e.detail);
    this.actionChatbot.handleTranscript(e.detail);
  }

  onEnter() {
    super.onEnter();

    document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
  }

  onExit() {
    super.onExit();

    document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
  }
}