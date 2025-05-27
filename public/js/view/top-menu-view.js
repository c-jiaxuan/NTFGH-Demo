import { BaseView } from './base-view.js';
import { appSettings } from '../config/appSettings.js';

const languageOptions = {
  en: {
    label: "English",
    icon: "./img/icon/lang_en.png",
    homeLabel: "Home",
    inputModeLabels: { touch: "Touch", voice: "Voice" },
  },
  zh: {
    label: "中文",
    icon: "./img/icon/lang_zh.png",
    homeLabel: "主页",
    inputModeLabels: { touch: "触控", voice: "语音" },
  },
};

const inputModeOptions = {
  touch: { icon: "./img/icon/tap_icon.png" },
  voice: { icon: "./img/icon/speaking-icon.png" },
};

export class TopMenuView extends BaseView {
  constructor(id) {
    super(id);

    this.homeButton = document.getElementById('home-button');
    this.languageStatus = document.getElementById('language-status');
    this.modeStatus = document.getElementById('mode-status');

    this.bindUI();
  }

  bindUI() {
    this.homeButton.addEventListener('click', () => this.emit("homeClicked"));
    this.languageStatus.addEventListener('click', () => this.handleLanguageToggle());
    this.modeStatus.addEventListener('click', () => this.handleInputModeToggle());
  }

  showHomeButton(isShown) {
    this.homeButton.style.visibility = isShown ? "visible" : "hidden";
  }

  updateLanguageStatus(lang) {
    const langData = languageOptions[lang];

    // Icon + label
    const icon = this.languageStatus.querySelector('.button-icon');
    const text = this.languageStatus.querySelector('.button-text');
    if (icon) icon.src = langData.icon;
    if (text) text.innerHTML = langData.label;

    // Home label
    const homeText = this.homeButton.querySelector('.button-text');
    if (homeText) homeText.innerHTML = langData.homeLabel;

    // Refresh input mode label in new language
    this.updateInputModeStatus(appSettings.inputMode);
  }

  updateInputModeStatus(mode) {
    const modeData = inputModeOptions[mode];
    const label = languageOptions[appSettings.language].inputModeLabels[mode];

    const icon = this.modeStatus.querySelector('.button-icon');
    const text = this.modeStatus.querySelector('.button-text');
    if (icon) icon.src = modeData.icon;
    if (text) text.innerHTML = label;
  }

  handleLanguageToggle() {
    const keys = Object.keys(languageOptions);
    const index = keys.indexOf(appSettings.language);
    const nextLang = keys[(index + 1) % keys.length];
    this.updateLanguageStatus(nextLang);
    this.emit("languageChanged", nextLang);
  }

  handleInputModeToggle() {
    const keys = Object.keys(inputModeOptions);
    const index = keys.indexOf(appSettings.inputMode);
    const nextMode = keys[(index + 1) % keys.length];
    this.updateInputModeStatus(nextMode);
    this.emit("inputModeChanged", nextMode);
  }
}