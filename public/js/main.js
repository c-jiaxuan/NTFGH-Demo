import { EventBus, Events } from "./event-bus.js";
import languageController from './language-controller.js';
import inputModeController from './input-mode-controller.js';
import topMenuView from './view/top-menu-view.js';


import avatar from './avatar.js';

topMenuView.showHomeButton(true);
topMenuView.updateInputModeStatus("touch");
topMenuView.updateLanguageStatus("en");

let inputMode = "voice";
let language = "en";

import { MainMenuPageController } from './controller/main-menu-controller.js';
import { SettingsPageController } from './controller/settings-page-controller.js';
import { OrientationPageController } from './controller/orientation-page-controller.js';
import { GettingStartedPageController } from "./controller/getting-started-controller.js";
import { PatientAssessmentPageController } from './controller/patient-assessment-page-controller.js';
import { DeliverPageController } from './controller/deliver-page-controller.js';

// import other page controllers as needed
const pages = {
  home: new MainMenuPageController("main-page"),
  settings: new SettingsPageController("setup-page"),
  gettingStarted : new GettingStartedPageController("getting-started-page"),
  orientation: new OrientationPageController("orientation-page"),
  assessment: new PatientAssessmentPageController("patient-assessment-page"),
  delivery: new DeliverPageController("delivery-page")
};

//store the current page
let currentPage = null;

//Hide all pages at start
Object.values(pages).forEach(controller => {
  controller.hide?.();
});

//Show home page
currentPage = pages["home"];

if(currentPage) currentPage.show();
else console.warn('No Main Page found');

function switchPage(pageName) {
  const nextPage = pages[pageName];
  if (!nextPage) {
    console.warn(`Page "${pageName}" not found`);
    return;
  }

  if (currentPage === nextPage) {
    console.log(`Already on "${pageName}" page`);
    return;
  }

  if (currentPage) currentPage.hide();
  if (nextPage) nextPage.show();
  currentPage = nextPage;
}

EventBus.on(Events.HOME_PRESS, () => { 
  switchPage('home');
});
EventBus.on(Events.UPDATE_LANGUAGE, (e) => { onUpdateLanguage(e.detail); })
EventBus.on(Events.UPDATE_INPUTMODE, (e) => { onUpdateInputMode(e.detail); })
EventBus.on(Events.SETTING_PRESS, () => {
  switchPage("settings");
  pages["settings"].init(language, inputMode);
});
EventBus.on(Events.GETTING_START_PRESS, () => {
  switchPage("gettingStarted");
  
});
EventBus.on(Events.START_ORIENTATION, () => {
  switchPage("orientation");
  pages["orientation"].start();
});
EventBus.on(Events.START_PATIENT_ASSESSMENT, () => {
  switchPage("assessment");
  pages["assessment"].startAssessment();
});
EventBus.on(Events.START_DELIVERY, () => {
  switchPage("delivery"); 
});

avatar.initAvatar();
//settingsView.init();

function onUpdateLanguage(language){
  console.log(language);
  this.language = language;
  //Update Avatar
  avatar.setLanguage(language);
  //Update chatbot

  //Update speech recognition
  
}

function onUpdateInputMode(mode){
  console.log(mode);

  //Update control mode
  this.inputMode = mode;
}

function startTranslate(text, lang){
  document.dispatchEvent(new CustomEvent('aws-start-translate', {
    detail: { 
      sourceText: text,
      targetLanguage: lang }
  }));
}

function startTranscribe(){
  document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
    detail: { language: 'en-US' }
  }));
}

document.addEventListener("aws-transcribe-update", (e) => {
  console.log("update" + e.detail);
});

document.addEventListener("aws-transcribe-complete", (e) => {
  console.log("transcribe" + e.detail);
});

document.addEventListener("aws-translate-complete", (e) => {
  console.log("translate" + e.detail);
});
