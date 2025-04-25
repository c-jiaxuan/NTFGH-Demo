import { EventBus, Events } from "./event-bus.js";
import { appSettings } from "./appSettings.js";
import avatar from './avatar.js';
import { MainMenuPageController } from './controller/main-menu-controller.js';
import { SettingsPageController } from './controller/settings-page-controller.js';
import { OrientationPageController } from './controller/orientation-page-controller.js';
import { GettingStartedPageController } from "./controller/getting-started-controller.js";
import { PatientAssessmentPageController } from './controller/patient-assessment-page-controller.js';
import { DeliverPageController } from './controller/deliver-page-controller.js';

import { TopMenuView } from "./view/top-menu-view.js";

import { updateOwnBubble, updateOtherBubble } from './view/chat-bubble-view.js';

// import other page controllers as needed
const pages = {
  home: new MainMenuPageController("main-page"),
  settings: new SettingsPageController("setup-page"),
  gettingStarted : new GettingStartedPageController("getting-started-page"),
  orientation: new OrientationPageController("orientation-page"),
  assessment: new PatientAssessmentPageController("patient-assessment-page"),
  delivery: new DeliverPageController("delivery-page")
};

const topMenuView = new TopMenuView('top-bar-container');

//Initialise
appSettings.language = 'en';
appSettings.inputMode = 'touch';

//Hide all pages at start
Object.values(pages).forEach(controller => {
  controller.hide?.();
});

//store the current page
let currentPage = null;

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

//Clear chat
updateOwnBubble("Hello! How can I help you today?");
updateOtherBubble("");

//Add events listener
EventBus.on(Events.HOME_PRESS, () => { 
  switchPage('home');
});
EventBus.on(Events.SETTING_PRESS, () => {
  switchPage("settings");
  pages["settings"].init(appSettings.inputMode, appSettings.language);
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
  pages["assessment"].start();
});
EventBus.on(Events.START_DELIVERY, () => {
  switchPage("delivery"); 
});
EventBus.on(Events.CHAT_UPDATE, (e) => {
  if(e.detail.ownText != null)
    updateOwnBubble(e.detail.ownText);

  if(e.detail.otherText != null)
    updateOtherBubble(e.detail.otherText);
});

//initialise the top view
topMenuView.updateLanguageStatus(appSettings.language);
topMenuView.updateInputModeStatus(appSettings.inputMode);

topMenuView.on("homeClicked", () => {
  switchPage('home');
});

topMenuView.on("languageChanged", (e) => {
  onUpdateLanguage(e.detail);
});

topMenuView.on("inputModeChanged", (e) => {
  onUpdateInputMode(e.detail);
});

avatar.initAvatar();

function onUpdateLanguage(newLanguage){
  if(newLanguage != "en" && newLanguage != "zh")
    newLanguage = newLanguage == "English" ? "en" : "zh";
  
  appSettings.language = newLanguage;
  console.log('settings:' + appSettings.language);
  //Update Avatar
  avatar.setLanguage(newLanguage);
  
  topMenuView.updateLanguageStatus(newLanguage);

  EventBus.emit(Events.UPDATE_LANGUAGE, newLanguage);
}

function onUpdateInputMode(mode){
  mode = mode.toLowerCase();

  //Update control mode
  appSettings.inputMode = mode;
  console.log('settings:' + appSettings.inputMode);

  topMenuView.updateInputModeStatus(mode);

  EventBus.emit(Events.UPDATE_INPUTMODE, mode);
}

document.addEventListener("aws-start-transcribe", (e) => {
  updateOwnBubble("Transcribing...");
});

document.addEventListener("aws-stop-transcribe", (e) => {
  updateOwnBubble("Stop Transcribing...");
});

document.addEventListener("aws-transcribe-update", (e) => {
  updateOtherBubble("User is speaking\n" + e.detail);
});

document.addEventListener("aws-transcribe-complete", (e) => {
  if(e.detail != "")
    updateOtherBubble("User finished speaking\n" + e.detail);
});

// document.addEventListener("aws-translate-complete", (e) => {
//   console.log("translate" + e.detail);
// });
