import { EventBus, Events } from "./event-bus.js";
import settingsView from "./view/settings-view.js";

// main.js
import languageController from './language-controller.js';
import inputModeController from './input-mode-controller.js';
import topMenuView from './view/top-menu-view.js';
import orientationController from './orientation-controller.js';

import avatar from './avatar.js';

const mainPage = document.getElementById('main-page');
const orientationPage = document.getElementById('orientation-page')

const acknowledgeBtn = document.getElementById('acknowledge-btn');
const backBtn = document.getElementById('back-btn');
const helpBtn = document.getElementById('help-btn');
const orientationBtn = document.getElementById('orientation-button');

const avatarDisplay = document.getElementById('AIPlayerWrapper');

topMenuView.showHomeButton(true);
topMenuView.updateInputModeStatus("touch");
topMenuView.updateLanguageStatus("en");

let inputMode = "voice";
let language = "en";

// Initial render
orientationController.init();

function startOrientation(){
  mainPage.style.visibility = 'hidden';
  orientationController.enable(true);
  orientationController.renderStep();
}

avatar.initAvatar();
settingsView.init();

EventBus.on(Events.HOME_PRESS, () => { onHomeButtonPressed(); });
EventBus.on(Events.UPDATE_LANGUAGE, (e) => { onUpdateLanguage(e.detail); })
EventBus.on(Events.UPDATE_INPUTMODE, (e) => { onUpdateInputMode(e.detail); })

function onHomeButtonPressed(){
  console.log("home-pressed");
}

function onUpdateLanguage(language){
  console.log(language);
  //Update Avatar
  avatar.setLanguage(language);
  //Update chatbot

  //Update speech recognition
  
}

function onUpdateInputMode(mode){
  console.log(mode);

  //Update control mode
  inputMode = mode;
}

avatarDisplay.addEventListener('click', () => {
  avatar.speak("Hello, shall we get started?");
});

orientationBtn.addEventListener('click', () => {
  startOrientation();
});

// Advance on button click
acknowledgeBtn.addEventListener('click', () => {
  orientationController.handleAcknowledge();
});
