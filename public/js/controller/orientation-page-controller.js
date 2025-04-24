import { BasePageController } from './base-page-controller.js';
import { OrientationView } from '../view/orientation-view.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { steps } from './orientation-config.js'
import { ActionBarController } from './action-bar-controller.js';
import { appSettings } from '../appSettings.js';

export class OrientationPageController extends BasePageController {
  constructor(id){
    const view = new OrientationView(id);
    super(id, view);

    this.actionBar = new ActionBarController('bottom-action-bar');

    this.major = 0;
    this.minor = 0;
    this.continueTimer = 1;
    this.nextQns = false;
    this.currentStep = null;
    
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
    //Listen to global events
    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
  }

  //Handle events for language and input mode 
  onUpdateLanguage(language){
    //update view to new language
    this.setupStep(language);
  }

  onUpdateInputMode(inputMode){

  }

  start(){
    this.major = 0;
    this.minor = 0;
    this.nextQns = false;
    this.setupStep(appSettings.language);
    
    // const avatarSpeechesInChinese = this.getAvatarSpeechesByLanguage(appSettings.language);
    // EventBus.emit(AvatarEvents.PRELOAD, avatarSpeechesInChinese);

    this.actionBar.show();
  }

  getAvatarSpeechesByLanguage(lang = 'en') {
    const speeches = [];
  
    steps.forEach(majorStep => {
      majorStep.substeps.forEach(substep => {
        let speech = substep.avatarSpeech;
  
        // If language is not 'en' and a translation exists, override
        if (lang !== 'en' && substep.translations?.[lang]?.avatarSpeech) {
          speech = substep.translations[lang].avatarSpeech;
        }
  
        if (speech) {
          speeches.push({ message: speech, gesture: "" });
        }
      });
    });
  
    return speeches;
  }

  getNextAvatarSpeech(major, minor, lang = 'en') {
    // Calculate next step indices
    const currentStep = steps[major];
    const isLastInSubsteps = minor >= currentStep.substeps.length - 1;
  
    let nextMajor = major;
    let nextMinor = minor + 1;
  
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

  setupStep(language){
    if(!this.isActive) return;

    this.actionBar.update(this.major != 0 || this.minor != 0);
    this.actionBar.enableAcknowledge(false);

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

    localizedSub.countdownMessage = this.getCountdownMessageFunction(language);
    localizedSub.language = language;

    this.view.renderStep(curMajorStep, localizedSub, this.major, this.minor);
    if(localizedSub.avatarSpeech != "") EventBus.emit(AvatarEvents.SPEAK, {message: localizedSub.avatarSpeech, gesture: ""});

    const nextSpeech = this.getNextAvatarSpeech(this.major, this.minor, language);
    EventBus.emit(AvatarEvents.PRELOAD, nextSpeech);
  }

  onQuizAnswered(e){
    this.nextQns = e.detail;
  }

  handleActionBarClicked(key){
    if(!this.isActive) return;
    console.log(key);
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
  
      const currentSubstep = steps[this.major].substeps[this.minor];
      if (currentSubstep.type !== 'quiz') {
        break;
      }
    }

    this.setupStep(appSettings.language);
  }

  getCountdownMessageFunction(language) {
    const texts = {
      en: "Video is starting in",
      zh: "视频将在"
    };
    const prefix = texts[language] || texts.en;
  
    return function(count) {
      return `${prefix} ${count}`;
    };
  }
  

  onEnter() {
    super.onEnter();
    console.log('Orientation page initialized');
  }

  onExit() {
    super.onExit();
    console.log('Leaving Orientation page');
    this.actionBar.hide();
  }
}