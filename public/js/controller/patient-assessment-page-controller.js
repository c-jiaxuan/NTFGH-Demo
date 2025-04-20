import { BasePageController } from './base-page-controller.js';
import { PatientAssessmentView } from '../view/patient-assessment-view.js';
import { EventBus, Events } from '../event-bus.js';
import { steps } from './assessment-config.js';
import { ActionBarView } from '../view/action-bar-view.js';

export class PatientAssessmentPageController extends BasePageController {
  constructor(id){
    const view = new PatientAssessmentView(id);
    super(id, view);

    this.actionBar = new ActionBarView('bottom-action-bar');

    this.currentStepIndex = 0;
    this.currentStep = steps[this.currentStepIndex];

    this.view.on("readyForAcknowledge", (e) => {
      this.onStepReadyForAcknowledge(e.detail);
    });

    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      this.nextStep();
    });
  }

  startAssessment(){
    this.currentStepIndex = 0;
    this.currentStep = steps[this.currentStepIndex];

    this.showCurrentStep();

    this.actionBar.show();
    this.actionBar.showHelpBtn(true);
    this.actionBar.showAcknowledgeBtn(true);
  }

  onStepReadyForAcknowledge(e){
    this.actionBar.enableAcknowledgeBtn(true);
  }
  
  handleActionBarClicked(key){
    if(!this.isActive) return;
    
    switch (key){
      case "back":
        this.previousStep();
        break;
      case "help":
        break;
      case "acknowledge":
        this.actionBar.countdownAcknowledgeBtn(1, true);
        break;
    }
  }

  showCurrentStep() {
    const step = steps[this.currentStepIndex];

    this.actionBar.showBackBtn(this.currentStepIndex > 0);
    this.actionBar.enableAcknowledgeBtn(false);

    this.view.renderStep("zh", step);
  }

  nextStep() {
    if (this.currentStepIndex < steps.length - 1) {
      this.currentStepIndex++;
      this.showCurrentStep();
    } 
    else
      EventBus.emit(Events.HOME_PRESS);
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.showCurrentStep();
    }
  }

  onEnter() {
    super.onEnter();
    console.log('Patient Assessment page initialized');
    // Run animations, load data, start timers, etc.
  }

  onExit() {
    super.onExit();
    console.log('Leaving Patient Assessment page');
    // Cleanup, stop audio, etc.
    this.actionBar.hide();
  }
}