import { EventBus, Events } from "../event-bus.js";

const languageOptions = {
    en: { 
        label: "English", 
        icon: "./img/icon/lang_en.png", 
        homeLabel: "Home", 
        inputModeLabels: { touch: "Touch", voice: "Voice" }
    },
    zh: { 
        label: "中文", 
        icon: "./img/icon/lang_zh.png", 
        homeLabel: "主页", 
        inputModeLabels: { touch: "触控", voice: "语音" }
    },
};

const inputModeOptions = {
    touch: { icon: "./img/icon/tap_icon.png" },
    voice: { icon: "./img/icon/speaking-icon.png" },
};

let currentLanguage = 'en';
let currentInputMode = 'voice';

const homeButton        = document.getElementById('home-button');
const languageStatus    = document.getElementById('language-status');
const modeStatus        = document.getElementById('mode-status');

function showHomeButton(isShown){
    homeButton.style.visibility = isShown ? "visible" : "hidden";
}

function updateLanguageStatus(language){
    currentLanguage = language;

    const langData = languageOptions[language];

    // Update language icon and label
    const img = languageStatus.querySelector(".button-icon");
    const text = languageStatus.querySelector(".button-text");

    if (img)
        img.src = langData.icon;
    if (text)
        text.innerHTML = langData.label;

    // Update Home button text
    const homeText = homeButton.querySelector(".button-text");
    if (homeText)
        homeText.innerHTML = langData.homeLabel;

    // Update Input mode text
    updateInputModeStatus(currentInputMode); // to refresh label in current language
}

function updateInputModeStatus(mode){
    currentInputMode = mode;

    const img = modeStatus.querySelector(".button-icon");
    const text = modeStatus.querySelector(".button-text");

    const modeData = inputModeOptions[mode];
    const label = languageOptions[currentLanguage].inputModeLabels[mode];

    if (img)
        img.src = modeData.icon;
    if (text)
        text.innerHTML = label;
}

homeButton.addEventListener('click', () => {
    EventBus.emit(Events.HOME_PRESS);
});

languageStatus.addEventListener('click', () => { 
    toggleLanguage();
});

function toggleLanguage()
{
    const keys = Object.keys(languageOptions);
    const index = keys.indexOf(currentLanguage);
    const nextLang = keys[(index + 1) % keys.length];
    updateLanguageStatus(nextLang);
    EventBus.emit(Events.UPDATE_LANGUAGE, nextLang);
}

modeStatus.addEventListener('click', () => { 
    toggleInput();
});

function toggleInput()
{
    const keys = Object.keys(inputModeOptions);
    const index = keys.indexOf(currentInputMode);
    const nextMode = keys[(index + 1) % keys.length];
    updateInputModeStatus(nextMode);
    EventBus.emit(Events.UPDATE_INPUTMODE, nextMode);
}

export default {
    showHomeButton,
    updateInputModeStatus,
    updateLanguageStatus
};
