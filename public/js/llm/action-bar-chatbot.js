export class ActionBarChatbot {
  constructor(actionBarView, language = 'en') {
    this.actionBar = actionBarView;
    this.language = language; // 'en' or 'zh'

    // Command triggers by language
    this.commandSets = {
      en: {
        back: ['go back', 'previous', 'return'],
        help: ['try again'],
        acknowledge: ['continue', 'next', 'proceed', 'acknowledge', 'done'],
        generate: ['generate, finish'],
      },
      zh: {
        back: ['返回', '上一步', '退回'],
        help: ['帮忙', '帮助', '再试一次', '我需要帮助'],
        acknowledge: ['继续', '下一步', '确认', '完成'],
        generate: ['生成', '完成'],
      }
    };
  }

  /**
   * Set language dynamically
   * @param {string} lang - 'en' or 'zh'
   */
  setLanguage(lang) {
    if (this.commandSets[lang]) {
      this.language = lang;
      console.log(`[Chatbot] Language set to '${lang}'`);
    } else {
      console.warn(`[Chatbot] Unsupported language: '${lang}'`);
    }
  }

  /**
   * Main method to call with transcribed speech
   * @param {string} transcript - plain string from AWS Transcribe
   */
  handleTranscript(transcript) {
    const cleaned = transcript.toLowerCase().trim();
    const commands = this.commandSets[this.language] || this.commandSets['en'];

    for (const [command, triggers] of Object.entries(commands)) {
      if (triggers.some(phrase => cleaned.includes(phrase))) {
        console.log(`[Chatbot] Triggering '${command}' from phrase: "${cleaned}"`);
        this.simulateButtonClick(command);
        break;
      }
    }
  }

  /**
   * Simulate click on the ActionBar button
   * @param {string} key - 'back', 'help', or 'acknowledge'
   */
  simulateButtonClick(key) {
    const button = this.actionBar.buttons[key];
    if (button && button.offsetParent !== null) {
      button.click();
    }
  }
}
