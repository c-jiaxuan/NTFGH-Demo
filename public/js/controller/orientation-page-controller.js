import { BasePageController } from './base-page-controller.js';
import { OrientationView } from '../view/orientation-view.js';
import { EventBus, Events } from '../event-bus.js';
import { steps } from './orientation-config.js'
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';

export class OrientationPageController extends BasePageController {
  constructor(id){
    const view = new OrientationView(id);
    super(id, view);

    this.actionBar = new ActionBarView('bottom-action-bar');
    this.actionChatbot = new ActionBarChatbot(this.actionBar);

    this.major = 0;
    this.minor = 0;
    this.continueTimer = 1;
    this.nextQns = false;
    this.currentStep = null;

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

  start(){
    this.major = 0;
    this.minor = 0;
    this.nextQns = false;

    this.actionBar.show();
    this.actionBar.showHelpBtn(false);
    this.actionBar.showAcknowledgeBtn(true);
    this.setupStep();
  }

  setupStep(){
    this.actionBar.showBackBtn(this.major != 0 || this.minor != 0);
    this.actionBar.enableAcknowledgeBtn(false);

    const curMajorStep = steps[this.major];
    const sub = curMajorStep.substeps[this.minor];

    this.view.renderStep(curMajorStep, sub, this.major, this.minor);
  }

  onStepReadyForAcknowledge(e){
    this.actionBar.enableAcknowledgeBtn(true);

    document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
      detail: { language: 'en-US', timeout: false }
    }));
  }

  onQuizAnswered(e){
    this.nextQns = e.detail;
  }

  handleActionBarClicked(key){
    if(!this.isActive) return;
    
    switch (key){
      case "back":
        document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
          detail: { language: 'en-US' }
        }));
        this.previousStep();
        break;
      case "help":
        break;
      case "acknowledge":
        document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
          detail: { language: 'en-US' }
        }));
        this.actionBar.countdownAcknowledgeBtn(1, true);
        break;
    }
  }

  nextStep() {
    const curMajorStep = steps[this.major];
    const sub = curMajorStep.substeps[this.minor];

    if(sub.type === "quiz")
    {
      if(this.nextQns){
        if (this.minor < curMajorStep.substeps.length - 1) {
          this.minor++;
        } else {
          if (this.major < steps.length - 1) {
            this.major++;
            this.minor = 0;
          } else {
            EventBus.emit(Events.HOME_PRESS);
            return;
          }
        }
      }
      else{
        //To change
        this.major++;
        this.minor = 0;   
      }
    } else {
      if (this.minor < curMajorStep.substeps.length - 1) {
        this.minor++;
      } else {
        if (this.major < steps.length - 1) {
          this.major++;
          this.minor = 0;
        } else {
          EventBus.emit(Events.HOME_PRESS);
          return;
        }
      }
    }

    this.setupStep();
  }

  previousStep()
  {
    while (true) {
      if (this.minor > 0) {
        this.minor--;
      } else if (this.major > 0) {
        this.major--;
        this.minor = steps[this.major].substeps.length - 1;
      } else {
        console.log("Already at the beginning.");
        return;
      }
  
      const currentSubstep = steps[this.major].substeps[this.minor];
      if (currentSubstep.type !== 'quiz') {
        break;
      }
    }

    this.setupStep();
  }

  handleTranscribeEvent(e){
    console.log("transcribe" + e.detail);
    this.actionChatbot.handleTranscript(e.detail);
  }

  onEnter() {
    super.onEnter();
    console.log('Orientation page initialized');

    document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
  }

  onExit() {
    super.onExit();
    console.log('Leaving Orientation page');
    this.actionBar.hide();
    document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      detail: { language: 'en-US' }
    }));
    
    document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
  }
}