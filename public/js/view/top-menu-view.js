import { EventBus, Events } from "../event-bus.js";

const languageOptions = {
    en: { label: "English", icon: "./img/icon/lang_en.png" },
    zh: { label: "中文", icon: "./img/icon/lang_zh.png" },
};

const inputModeOptions = {
    touch: { label: "Touch", icon: "./img/icon/tap_icon.png" },
    voice: { label: "Voice", icon: "./img/icon/speaking-icon.png" },
};

const homeButton        = document.getElementById('home-button');
const languageStatus    = document.getElementById('language-status');
const modeStatus        = document.getElementById('mode-status');

function showHomeButton(isShown){
    homeButton.style.visibility = isShown ? "visible" : "hidden";
}

function updateLanguageStatus(language){
    const img = languageStatus.querySelector(".button-icon");
    const text = languageStatus.querySelector(".button-text");

    const languageData = languageOptions[language];

    if (img)
        img.src = languageData.icon;
    if (text)
        text.innerHTML = languageData.label;
}

function updateInputModeStatus(mode){
    const img = modeStatus.querySelector(".button-icon");
    const text = modeStatus.querySelector(".button-text");

    const modeData = inputModeOptions[mode];

    if (img)
        img.src = modeData.icon;
    if (text)
        text.innerHTML = modeData.label;
}

homeButton.addEventListener('click', () => {
    EventBus.emit(Events.HOME_PRESS);
});

languageStatus.addEventListener('click', () => { 
    //Activate settings page
    
});

modeStatus.addEventListener('click', () => { 
    //Activate settings page
    
});

export default {
    showHomeButton,
    updateInputModeStatus,
    updateLanguageStatus
}