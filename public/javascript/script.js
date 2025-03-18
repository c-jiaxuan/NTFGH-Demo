// APP STATEs
// Loading - Video load, Chatbot load, Avatar load, Wayfinding load
// Idle
// Transcribing
// LLM responding
// Avatar processing
// Avatar speaking

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

// Initialize the app
function initApp () {
    // Start loading chatbot, avatar
    // send out the event to start loading chatbot
    initSample();

    // Set app state to loading
    appController.updateAppState(APP_STATE.LOADING, true);
}

// Define events
const LOADING_APP = new Event('LOADING_APP');
const LANGUAGE_CHANGE = new Event('LANGUAGE_CHANGE');

// *********************** Event Listeners *********************** //
document.addEventListener('DOMContentLoaded', function (evt) {
    initApp();
});

document.getElementById('langSelector').addEventListener('change', function (evt) {
    const selectedLanguage = evt.target.value; // Get selected language
    const selectedIndex = evt.target.selectedIndex; // Get selected index
    console.log("selectedIndex = " + selectedIndex);
    const languageChangeEvent = new CustomEvent('LANGUAGE_CHANGE', {
        detail: { 
            language: selectedLanguage,
            index: selectedIndex 
        }
    });
    document.dispatchEvent(languageChangeEvent);
});

// AI Player has loaded, but has not preloaded finished
document.addEventListener('AIPLAYER_LOAD_COMPLETE', function (evt) {
    loadChat();
    getFilesFromFolder('../videos');
});

// Preloading is finished
document.addEventListener('AICLIPSET_PRELOAD_COMPLETED', function (evt) {
    incrementPreloadCount();
    if(isPreloadingFinished()) {
        // Chatbot to begin chat
        beginChat();
        // App is now in its IDLE state after preloading has finished
        appController.updateAppState(APP_STATE.IDLE);
    }
});

// Listens for any SPEAK_EVENT
document.addEventListener('SPEAK_EVENT', function (evt) {
    console.log("Received SPEAK_EVENT with data: " + evt.detail.message + ", " + evt.detail.gesture);
    speak(evt.detail.message, evt.detail.gesture);
    appController.updateAppState(APP_STATE.AVATAR_PROCESSING);
});

