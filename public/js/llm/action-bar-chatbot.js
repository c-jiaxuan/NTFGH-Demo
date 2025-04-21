export class ActionBarChatbot {
    constructor(actionBarView) {
      this.actionBar = actionBarView;
  
      // Define keyword triggers
      this.commands = {
        back: ['go back', 'previous', 'return'],
        help: ['help', 'i need help', 'try again'],
        acknowledge: ['continue', 'next', 'proceed', 'acknowledge', 'done']
      };
    }
  
    /**
     * Main method to call with transcribed speech
     * @param {string} transcript - plain string from AWS Transcribe
     */
    handleTranscript(transcript) {
      const cleaned = transcript.toLowerCase().trim();
  
      for (const [command, triggers] of Object.entries(this.commands)) {
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