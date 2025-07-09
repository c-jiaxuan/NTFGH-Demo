import { BasePageController } from './base-page-controller.js';
import { OrientationView } from '../view/orientation-view.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { steps } from '../config/assessment-config.js';
import { ActionBarController } from './action-bar-controller.js';
import { appSettings } from '../config/appSettings.js';

export class OrientationPageController extends BasePageController {
  constructor(id){
    const view = new OrientationView(id);
    super(id, view);

    //action bar of the page
    this.actionBar = new ActionBarController('bottom-action-bar');

    //page-related settings
    this.major = 0;
    this.minor = 0;
    this.nextQns = false; //logic need to be updated. should store which step is next
  }

  onEnter() {
    super.onEnter();
    console.log('Orientation page initialized');

    //Show actionbar together with it
    this.actionBar.show();

    //Listen to its own view event
    this.view.on("readyForAcknowledge", (e) => {
      this.actionBar.enableAcknowledge(true);
    });

    this.view.on("quizAnswered", (e) => {
      this.onQuizAnswered(e.detail);
    })

    //Listen to action bar controller event
    this.actionBar.on("acknowledged", (e) => {
      this.nextStep();
    });
    this.actionBar.on("action-button-clicked", (e) => { 
      this.handleActionBarClicked(e.detail);
    })

    //Listen to global events
    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

  onExit() {
    super.onExit();
    console.log('Leaving Orientation page');

    //Hide the action bar together with it
    this.actionBar.hide();

    //Remove listen to its own view event
    this.view.off("readyForAcknowledge", (e) => {
      this.actionBar.enableAcknowledge(true);
    });

    this.view.off("quizAnswered", (e) => {
      this.onQuizAnswered(e.detail);
    })

    //Remove listen to action bar controller event
    this.actionBar.off("acknowledged", (e) => {
      this.nextStep();
    });
    this.actionBar.off("action-button-clicked", (e) => { 
      this.handleActionBarClicked(e.detail);
    })

    //Remove listen to global events
    EventBus.off(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.off(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

  //Handle events for language and input mode 
  onUpdateLanguage(language){
    //update view to new language
    this.setupStep(language);
  }

  onUpdateInputMode(inputMode){

  }

  //Start orientation -> reset all variables
  start(){
    this.major = 0;
    this.minor = 0;
    this.nextQns = false;

    this.setupStep(appSettings.language);
  }

  //Get the next avatar speech to preload
  getNextAvatarSpeech(major, minor, lang = 'en') {
    // Calculate next step indices
    const currentStep = steps[major];
    const isLastInSubsteps = minor >= currentStep.substeps.length - 1;
  
    let nextMajor = major;
    let nextMinor = minor + 1;
  
    //if last substep in current major step -> move on to next major step
    if (isLastInSubsteps) {
      nextMajor = major + 1;
      nextMinor = 0;
    }
  
    // Check if within bounds
    if (nextMajor >= steps.length || nextMinor >= steps[nextMajor].substeps.length) {
      return null; // No next step
    }
  
    const nextStep = steps[nextMajor].substeps[nextMinor];
  
    let speech = nextStep.avatarSpeech;
  
    if (lang !== 'en' && nextStep.translations?.[lang]?.avatarSpeech) {
      speech = nextStep.translations[lang].avatarSpeech;
    }
  
    return speech ? { message: speech, gesture: "" } : null;
  }

  //Setup the current step
  setupStep(language)
  {
    //Ensure dont setup step if the page is not in focus
    if(!this.isActive) return;

    //Update action bar status
    this.actionBar.update(this.major != 0 || this.minor != 0);
    this.actionBar.enableAcknowledge(false);

    //Get the data ready for the view to display
    const curMajorStep = steps[this.major];
    const sub = curMajorStep.substeps[this.minor];

    const lang = language;

    const localizedTitle = (lang !== 'en' && curMajorStep.translations?.[lang]?.title)
      ? curMajorStep.translations[lang].title
      : curMajorStep.title;

    curMajorStep.localizedTitle = localizedTitle;

    const localizedSub = (lang !== 'en' && sub.translations?.[lang])
      ? { ...sub, ...sub.translations[lang] }
      : sub;

    localizedSub.language = language;

    this.view.renderStep(curMajorStep, localizedSub, this.major, this.minor);

    //Avatar
    //Speak current step if not empty
    if(localizedSub.avatarSpeech != "") EventBus.emit(AvatarEvents.SPEAK, {message: localizedSub.avatarSpeech, gesture: ""});
    //Preload the next one
    const nextSpeech = this.getNextAvatarSpeech(this.major, this.minor, language);
    EventBus.emit(AvatarEvents.PRELOAD, nextSpeech);

    //Not fully tested - voice detection for quiz answering
    // if(sub.type == "quiz" && appSettings.inputMode == "voice")
    // {
    //   this.setupTranscribeForVoiceCommmand(true);
    // }
  }

  nextStep() {
    const curMajorStep = steps[this.major];
    const isLastSubstep = this.minor >= curMajorStep.substeps.length - 1;
    const isLastMajorStep = this.major >= steps.length - 1;
    const sub = curMajorStep.substeps[this.minor];

    if (sub.type === "quiz" && !this.nextQns) {
      // Skip to next major step -> logic to be updated
      if (!isLastMajorStep) {
        this.major++;
        this.minor = 0;
      } else {
        EventBus.emit(Events.HOME_PRESS);
        return;
      }
    } else {
      // Proceed to next substep or next major step
      if (!isLastSubstep) {
        this.minor++;
      } else if (!isLastMajorStep) {
        this.major++;
        this.minor = 0;
      } else {
        EventBus.emit(Events.HOME_PRESS);
        return;
      }
    }

    this.setupStep(appSettings.language);
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
  
      //Don't go back if it's a quiz step
      const currentSubstep = steps[this.major].substeps[this.minor];
      if (currentSubstep.type !== 'quiz') {
        break;
      }
    }

    this.setupStep(appSettings.language);
  }

  //Handle quiz answer -> to determine whether to proceed or skip
  onQuizAnswered(e){
    this.nextQns = e.detail;

    //Not fully tested - voice detection for quiz answering
    // if(appSettings.inputMode == "voice")
    //   this.setupTranscribeForVoiceCommmand(false);
  }

  //Handle action bar buttons -> proceed or back
  handleActionBarClicked(key)
  {
    if(!this.isActive) return;

    switch (key){
      case "back":
        this.previousStep();
        break;
      case "help":
        break;
      case "acknowledge":
        this.actionBar.countdownAcknowledgeBtn(true);
        break;
    }
  }

  //Not in used -     //Not fully tested - voice detection for quiz answering
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

   async handleTranscribeEvent(e){
      console.log("transcribe" + e.detail);
  
      const curMajorStep = steps[this.major];
      const sub = curMajorStep.substeps[this.minor];

      if (sub.type === "quiz") {
        const matched = this.findMatchingOption(e.detail, sub.content.options, appSettings.language);
        console.log("orientation-page" + sub.content.options);
        
        if (matched) {
          console.log("User selected option:", matched);
      
          // Optional: simulate click on the matching button
          const allButtons = document.querySelectorAll('#quizSubstep .action-button');
          allButtons.forEach(btn => {
            if (btn.textContent.trim().toLowerCase() === matched.text.toLowerCase() ||
                btn.textContent.trim().toLowerCase() === matched.translations?.[appSettings.language]?.toLowerCase()) {
              btn.click();
            }
          });
        }
      }
  }

  findMatchingOption(transcript, options, lang = 'en') {
    transcript = transcript.trim().toLowerCase();
  
    for (const option of options) {
      // Match default text
      if (option.text.toLowerCase() === transcript) return option;
  
      // Match translated text if available
      if (lang !== 'en' && option.translations?.[lang]?.toLowerCase() === transcript) {
        return option;
      }
    }
  
    return null; // No match
  }
}