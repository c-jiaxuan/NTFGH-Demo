// APP STATEs
// Loading - Video load, Chatbot load, Avatar load, Wayfinding load
// Idle
// Transcribing
// LLM responding
// Avatar processing
// LLM speaking

//App states freeze is used to prevent mutations to the state's values
const APP_STATE = Object.freeze({
    LOADING: -1,
    IDLE: 0,
    TRANSCRIBING: 1,
    LLM_RESPONDING: 2,
    AVATAR_PROCESSING: 3,
    AVATAR_SPEAKING: 4,
})

class AppController {
    constructor() {
        this.state = APP_STATE.NONE;
    
        this.aiPlayerInit = false;
        this.transcribeInit = false;
    }

    getState = () => {
        return this.state;
    }

    onAIPlayerInit = () => {
        this.aiPlayerInit = true;
        this.checkAndUpdateInitState();
      }

    onTranscribeInit = () => {
        this.transcribeInit = true;
        this.checkAndUpdateInitState();
    }

    updateAppState(newState, isForce) {
        if (isForce) {
            this.state = newState;
        } else {
            if ((this.state == APP_STATE.AVATAR_SPEAKING || this.state == APP_STATE.AVATAR_PROCESSING) 
             && newState == APP_STATE.TRANSCRIBING) {
                return false;
            } else {
                this.state = newState;
            }
        } 
        return true;
    }
}

const appController = new AppController();


// initApp();

// Initialize the app
function initApp () {
    // Start loading chatbot, avatar
    initSample();

    // Set app state to loading
    appController.updateAppState(APP_STATE.LOADING, true);

    // listen for preloading finished
    // once finished preloading set state to idle

}

// Define events
const LANGUAGE_CHANGE = new Event('LANGUAGE_CHANGE');

document.getElementById('langSelector').addEventListener('change', function (evt) {
    const selectedLanguage = evt.target.value; // Get selected language
    const languageChangeEvent = new CustomEvent('LANGUAGE_CHANGE', {
        detail: { language: selectedLanguage }
    });
    document.dispatchEvent(languageChangeEvent);
});

