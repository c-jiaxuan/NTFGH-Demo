class Transcriber {
  async startTranscribe() {
    console.log('startTranscribe');
    try {
      const { startRecording } = await import("./libs/transcribeClient.js");
      await startRecording('en-US', this.onTranscriptionDataReceived);

      return true;
    } catch (error) {
      alert("An error occurred while recording: " + error.message);
      await this.stopTranscribe();

      return false;
    }
  };

  onTranscriptionDataReceived(data, IsPartial) {
    awsController.updateTranscribingText(data, IsPartial);
  };

  async stopTranscribe() {
    console.log('stopTranscribe');
    const { stopRecording } = await import("./libs/transcribeClient.js");
    stopRecording();
  };
}

class Translater {
    async startTranslate(sourceText, targetLanguage) {
      console.log('startTranslate');
  
      try {
        const { translateTextToLanguage } = await import("./libs/translateClient.js");
  
        const translation = await translateTextToLanguage(sourceText, targetLanguage);
  
        awsController.onTranslationComplete(translation);
      } catch (error) {
        alert(`There was an error translating the text: ${error.message}`);
        return '';
      }
    }
}

class AwsController {
    constructor(){
        this.transcribeInit = false;
        this.translateInit = false;

        this.transcribingText = '';
        this.translatedText = '';
        this.partialText = '';

        this.hasTimeout = true;
        this.timeout = null;
        this.PAUSE_TIME = 3000; // 3 seconds pause time
    }

    isTranscriberReady = () => this.translateInit;
    isTranslateeady = () => this.translateInit;

    onTranscribeInit() {
        this.transcribeInit = true;
    }

    onTranslateInit() {
        this.translateInit = true;
    }

    // ==== TRANSCRIPTION ====
    startTranscribe = async () => {
        this.transcribingText = '';
        this.partialText = '';
        
        transcriber.startTranscribe();
    }

    // Reset the timeout timer when a new partial transcription is received
    resetTimeout() {
      console.log('Rest Timeout');

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.onPauseDetected();
      }, this.PAUSE_TIME);
    }

    // Handle when the user pauses for 3 seconds
    onPauseDetected() {
      console.log('User has paused for 3 seconds, completing transcription.');
      this.finalizeTranscription();
    }

    // Finalize the transcription
    finalizeTranscription() {
      console.log('Finalizing Transcription...');
      // Assuming you have a way to process the final transcription here
      this.transcribingText += this.partialText;
      this.partialText = ''; // Reset partial text
      console.log('Final Transcript:', this.transcribingText);
      // Call a callback or process the final transcript further
      this.onTranscribeComplete(this.transcribingText);
    }

    updateTranscribingText = (data, IsPartial) => {
      if (IsPartial && this.hasTimeout) this.resetTimeout();

      console.log(`updateTranscribingText ${data} - ${IsPartial}`);
        if (IsPartial) {
            // Live update without committing to final transcript
            this.partialText = data;
        } else {
            // Add finalized text to full transcript
            this.transcribingText += data + ' ';
            this.partialText = ''; // Clear partial once finalized
        }
    
        // Combine finalized + current partial for display
        const displayText = this.transcribingText + (IsPartial ? data : '');
        document.dispatchEvent(new CustomEvent("aws-transcribe-update", {
          detail: displayText
        }));
    }

    stopTranscribe = async() => {
      transcriber.stopTranscribe();

      document.dispatchEvent(new CustomEvent("aws-transcribe-complete", {
        detail: this.transcribingText
      }));

      this.transcribingText = '';
      this.partialText = '';

      clearTimeout(this.timeout);
    }

    onTranscribeComplete = async (finalTranscribedText) => {
      console.log(`onTranscribeComplete ${finalTranscribedText}`);
      transcriber.stopTranscribe();

      document.dispatchEvent(new CustomEvent("aws-transcribe-complete", {
        detail: finalTranscribedText
      }));

      this.transcribingText = '';
      this.partialText = '';

      clearTimeout(this.timeout);
    }

    resetTranscribe = () => { 
      this.transcribingText = '';
      this.IsPartial = '';
    }

    // ==== TRANSLATION ====
    onTranslationComplete(text) {
      document.dispatchEvent(new CustomEvent("aws-translate-complete", {
        detail: text
      }));
    }

    async startTranslate(sourceText, targetLang) {
      translater.startTranslate(sourceText, targetLang);
    }
}

const languageMap = {
  en: 'en-US',
  zh: 'zh-CN',
  //Add more to map
};

export const awsController = new AwsController();
const transcriber = new Transcriber();
awsController.onTranscribeInit();

const translater = new Translater();
awsController.onTranslateInit();


document.addEventListener('aws-start-transcribe', async (e) => {
  const { language, timeout } = e.detail;
  awsController.hasTimeout = timeout;
  await transcriber.startTranscribe(languageMap[language]);
});

document.addEventListener('aws-reset-transcribe', async (e) => {
  await transcriber.resetTranscribe();
});

document.addEventListener('aws-stop-transcribe', async () => {
  awsController.stopTranscribe();
});

document.addEventListener('aws-start-translate', async (e) => {
  const { sourceText, targetLanguage } = e.detail;
  await translater.startTranslate(sourceText, targetLanguage);
});