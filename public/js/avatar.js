//import LanguageController from './language.js';

import { EventBus, Events, AvatarEvents } from "./event-bus.js";

const wrapper = document.getElementById('AIPlayerWrapper');
const authServer = 'https://account.aistudios.com';
const AI_PLAYER = new AIPlayer(wrapper);
// const appId = 'c-jiaxuan.github.io';
// const userKey = '5979244e-7071-444a-a9fe-81217af1cbef';
// const appId = 'deepbrain.io';
// const userKey = 'bb872cb0-c6da-4c32-b68d-15ff95679837';

const appId = "demo-637l.onrender.com";
const userKey = "e7612a63-0da4-479b-8a7d-a7ab363c4d2a";

AI_PLAYER.setConfig({
    authServer: authServer,
    midServer: 'https://aimid.deepbrain.io/',
    // resourceServer: 'https://resource.deepbrainai.io',
    // backendServer: 'https://backend.deepbrainai.io',
});

//Avatar constant
const DATA = {
    appId: "",
    clientToken: "",
    verifiedToken: "",
    tokenExpire: "",
    maxTextLength: "",
    ai: "", // available AI List
    language: "", // AI Speak Language
    texts: [], // AI Speak List
};

// To store next speak in case of multiple speak
var isNextSpeakRegistered = false;
var nextSpeak = "";
  
class AI_Message {
    // Constructor method for initializing properties
    constructor(message, gesture) {
        this.message = message;
        this.gesture = gesture;
    }
}
  
let botMessages = {};   // Dictionary to store all preset bot messages
botMessages["start_msg"] = [new AI_Message("Welcome to Panasonic! How can I help you today?", "G05")
];
// botMessages["orientation"] = [new AI_Message("We would like to introduce to you the Care Team.", "G02"),
//     new AI_Message("Please watch this video")
// ];
// botMessages["assessment_msg"] = new AI_Message("What is your marital status?", "G02");
botMessages["speech_error_msg"] = new AI_Message("I am not sure what you have sent, please try again.");
botMessages["processing_msg"] = new AI_Message("Thank you! Please wait while I'm processing your question and I will reply to you shortly.");
  
// To track how many messages have been preloaded
let currentPreload = [];
var preloadCount = 0;
var totalMessages = 0;

var preloadStartTime = 0;
var preloadEndedTime = 0;
var preloadTotalTime = 0;

const LOADING_TIMEOUT = new Event('LOADING_TIMEOUT');
const PRELOAD_TIMEOUT = new Event('PRELOAD_TIMEOUT');
const VOICE_TIMEOUT = new Event('VOICE_TIMEOUT');

var currTimeout = null;
let curSpeech = '';

// Gender preset
const female_Avatar = true;

//Language preset
const englishMaleVoice = 'google/en-US/MALE_en-US-Standard-D';
const englishFemaleVoice = 'amazon/en-US/Female_Danielle';
const chineseFemaleVoice = 'google/cmn-CN/FEMALE_cmn-CN-Wavenet-A';

// en, zh, ms, ta
let aiLanguages = new Map();
aiLanguages.set('en', englishFemaleVoice);
aiLanguages.set('zh', chineseFemaleVoice);

// Events Listener
// Listen for app:language-changed event signalling user wants a change of language
document.addEventListener('app:language-changed', (event) => {
    setLanguage(event.detail.language);
});  

async function initAvatar() {
    initAIPlayerEvent();
    await generateClientToken();
    await generateVerifiedToken();
  
    await AI_PLAYER.init({
        aiName: "M000320746_BG00007441H_light",
        //aiName: "M000015844_BG00001112_light",
        size: 1.0,
        left: 0,
        top: 0,
        speed: 1.0,
    });

    setupEventHandler();
}

function setupEventHandler(){
    EventBus.on(AvatarEvents.PRELOAD, (e) => {
        preloadMessages(e.detail);
    });

    EventBus.on(AvatarEvents.SPEAK, (e) => {
        console.log(e.detail);
        curSpeech = e.detail["message"];
        EventBus.emit(Events.CHAT_UPDATE, { ownText: `[Preparing speech]\n\n ${curSpeech}`});
        speak(e.detail["message"], e.detail["gesture"]);
    });

    EventBus.on(AvatarEvents.STOP, (e) => {
        stop();
    });
}
  
// =========================== AIPlayer Setup ================================ //

// Method for v1.5.3
async function generateClientToken() {
    const result = await makeRequest(
        'GET',
        `${authServer}/api/aihuman/generateClientToken?appId=${appId}&userKey=${userKey}`,
    );

    if (result?.succeed) {
        DATA.clientToken = result.token;
        DATA.appId = result.appId;
    } else {
        console.log('generateClientToken Error:', result);
    }
}

// Method for <v1.5.3
//   async function generateClientToken() {
//       const result = await makeRequest("GET", "/api/generateJWT");
//       console.log("Generate Token");
//       if (result) {
//           console.log('generateClientToken', result)
  
//           // check request success
//           DATA.clientToken = result.token;
//           DATA.appId = result.appId;
//       } 
//       else 
//       {
//           console.log("Error: " + result?.error);
//       }
//   }
    
async function generateVerifiedToken() {
    const result = await AI_PLAYER.generateToken({ appId: DATA.appId, token: DATA.clientToken });

    if (result?.succeed) {
        DATA.verifiedToken = result.token;
        DATA.tokenExpire = result.tokenExpire;
        DATA.defaultAI = result.defaultAI;
    } else {
        console.log('generateVerifiedToken Error: ' + result);
    }
}
    
// if token is expired, get refresh clientToken, verifiedToken
async function refreshTokenIFExpired() {
    const afterExpired = moment().unix() + 60 * 60; // compare expire after 1 hour
    if (!DATA.tokenExpire || DATA.tokenExpire <= afterExpired) {
        await generateVerifiedToken();

        if (!DATA.verifiedToken) {
            // if clientToken is expired, get clientToken again
            await generateClientToken();
            await generateVerifiedToken();
        }
    }
}

// =========================== AIPlayer Callback ================================ //

function initAIPlayerEvent() {
    // TODO: AIPlayer error handling
    AI_PLAYER.onAIPlayerError = function (err) 
    {
        err => string || { succeed: false, errorCode: 1400, error: "...", description: "...", detail: "..." };
        
        const errorDetails = {
            succeed: false,
            errorCode: err?.errorCode || 1400,
            error: err?.error || "Unknown Error",
            description: err?.description || "No description provided",
            detail: err?.detail || "No details available"
        };

        // Create a custom event with error details
        const event = new CustomEvent("avatar:error", { detail: errorDetails });

        // Dispatch the event with details
        document.dispatchEvent(event);
    };

    // TODO: AIPlayer Loading State Change Handling
    AI_PLAYER.onAIPlayerStateChanged = function (state) {
        if (state === 'playerLoadComplete') {
            // To set custom voice
            //const customVoice = AI_PLAYER.findCustomVoice("google/en-US/FEMALE_en-US-Neural2-C");
            const customVoicePackMale = AI_PLAYER.findCustomVoice(englishMaleVoice);
            const customVoice = AI_PLAYER.findCustomVoice(englishFemaleVoice);
            const customChineseVoice = AI_PLAYER.findCustomVoice(chineseFemaleVoice);

            // Set custom voice will cause issues with the AI speaking
            const isSuccess = female_Avatar ? AI_PLAYER.setCustomVoice(customVoice) : AI_PLAYER.setCustomVoice(customVoicePackMale); 
            console.log(isSuccess ? "Successfully set custom voice" : "Unsuccessful in setting custom voice");
            
            const customVoice_check = AI_PLAYER.getCustomVoice();

            if (customVoice_check == null) {
                console.log("custom voice is not set");
            }

            preloadMessages(botMessages);

            // Send out event for script.js
            document.dispatchEvent(new Event('loading:avatar-completed'));
        }
    };

    //AIEvent & callback
    const AIEventType = Object.freeze({
        RES_LOAD_STARTED: 0,
        RES_LOAD_COMPLETED: 1,
        AICLIPSET_PLAY_PREPARE_STARTED: 2,
        AICLIPSET_PLAY_PREPARE_COMPLETED: 3,
        AICLIPSET_PRELOAD_STARTED: 4,
        AICLIPSET_PRELOAD_COMPLETED: 5,
        AICLIPSET_PRELOAD_FAILED: 6,
        AICLIPSET_PLAY_STARTED: 7,
        AICLIPSET_PLAY_COMPLETED: 8,
        AICLIPSET_PLAY_FAILED: 9,
        AI_CONNECTED: 10,
        AI_DISCONNECTED: 11,
        AICLIPSET_PLAY_BUFFERING: 12,
        AICLIPSET_RESTART_FROM_BUFFERING: 13,
        AIPLAYER_STATE_CHANGED: 14,
        UNKNOWN: -1,
    });

    AI_PLAYER.onAIPlayerEvent = function (aiEvent) {
        let typeName = '';
        switch (aiEvent.type) {
        case AIEventType.AIPLAYER_STATE_CHANGED:
            typeName = 'AIPLAYER_STATE_CHANGED';
            break;
        case AIEventType.AI_CONNECTED:
            typeName = 'AI_CONNECTED';
            break;
        case AIEventType.RES_LOAD_STARTED:
            typeName = 'RES_LOAD_STARTED';
            break;
        case AIEventType.RES_LOAD_COMPLETED:
            typeName = 'RES_LOAD_COMPLETED';
            break;
        case AIEventType.AICLIPSET_PLAY_PREPARE_STARTED:
            typeName = 'AICLIPSET_PLAY_PREPARE_STARTED';
            dispatchEvent(new Event('AICLIPSET_PLAY_PREPARE_STARTED'));
            break;
        case AIEventType.AICLIPSET_PLAY_PREPARE_COMPLETED:
            typeName = 'AICLIPSET_PLAY_PREPARE_COMPLETED';
            dispatchEvent(new Event('AICLIPSET_PLAY_PREPARE_COMPLETED'));
            break;
        case AIEventType.AICLIPSET_PRELOAD_STARTED:
            typeName = 'AICLIPSET_PRELOAD_STARTED';
            dispatchEvent(new Event('AICLIPSET_PRELOAD_STARTED'));

            // log start time
            preloadStartTime = performance.now();

            // Start timeout for 60 seconds (1 mins), if time out, dispatch an event
            // Stop setting timeout at the last message
            if (preloadCount != (totalMessages - 1)) {
                checkTimeOut(PRELOAD_TIMEOUT, 60000, 'preloading timeout after 1 minute');
            }

            break;
        case AIEventType.AICLIPSET_PRELOAD_COMPLETED:
            typeName = 'AICLIPSET_PRELOAD_COMPLETED';

            // Clear the timeout when preload for a message is finished
            clearTimeout(currTimeout);

            incrementPreloadCount();

            document.dispatchEvent(new Event('AICLIPSET_PRELOAD_COMPLETED'));

            // Stop logging time
            preloadEndedTime = performance.now();
            preloadTotalTime = preloadEndedTime - preloadStartTime;
            console.log('Time taken to preload = ' + (preloadTotalTime / 1000) + ' seconds(s)');
            break;
        case AIEventType.AICLIPSET_PLAY_STARTED:
            typeName = 'AICLIPSET_PLAY_STARTED';

            EventBus.emit(Events.CHAT_UPDATE, { ownText: curSpeech });

            if(isNextSpeakRegistered){
                isNextSpeakRegistered = false;
                speak(nextSpeak);
            }

            document.dispatchEvent(new Event('AICLIPSET_PLAY_STARTED'));
            break;
        case AIEventType.AICLIPSET_PLAY_COMPLETED:
            typeName = 'AICLIPSET_PLAY_COMPLETED';
            EventBus.emit(AvatarEvents.SPEAK_COMPLETED, {});
            dispatchEvent(new Event('AICLIPSET_PLAY_COMPLETED'));

            break;
        case AIEventType.AI_DISCONNECTED:
            typeName = 'AI_DISCONNECTED';
            AI_PLAYER.reconnect();
            break;
        case AIEventType.AICLIPSET_PRELOAD_FAILED:
            typeName = 'AICLIPSET_PRELOAD_FAILED';
            break;
        case AIEventType.AICLIPSET_PLAY_FAILED:
            typeName = 'AICLIPSET_PLAY_FAILED';

            document.dispatchEvent('AIPLAYER_PLAY_FAILED');

            break;
        case AIEventType.AICLIPSET_PLAY_BUFFERING:
            typeName = 'AICLIPSET_PLAY_BUFFERING';
            break;
        case AIEventType.AICLIPSET_RESTART_FROM_BUFFERING:
            typeName = 'AICLIPSET_RESTART_FROM_BUFFERING';
            break;
        case AIEventType.UNKNOWN:
            typeName = 'UNKNOWN';
            break;
    }

    console.log('onAIPlayerEvent:', aiEvent.type, typeName, 'clipSet:', aiEvent.clipSet);
        return;
    };

    //AIError & callback
    const AIErrorCode = Object.freeze({
        AI_API_ERR: 10000,
        AI_SERVER_ERR: 11000,
        AI_RES_ERR: 12000,
        AI_INIT_ERR: 13000,
        INVALID_AICLIPSET_ERR: 14000,
        AICLIPSET_PRELOAD_ERR: 15000,
        AICLIPSET_PLAY_ERR: 16000,
        RESERVED_ERR: 17000,
        UNKNOWN_ERR: -1,
    });

    AI_PLAYER.onAIPlayerErrorV2 = function (aiError) {
        let codeName = 'UNKNOWN_ERR';
        if (aiError.code >= AIErrorCode.RESERVED_ERR) {
        codeName = 'RESERVED_ERR';
        } else if (aiError.code >= AIErrorCode.AICLIPSET_PLAY_ERR) {
        codeName = 'AICLIPSET_PLAY_ERR';
        } else if (aiError.code >= AIErrorCode.AICLIPSET_PRELOAD_ERR) {
        codeName = 'AICLIPSET_PRELOAD_ERR';
        } else if (aiError.code >= AIErrorCode.INVALID_AICLIPSET_ERR) {
        codeName = 'INVALID_AICLIPSET_ERR';
        } else if (aiError.code >= AIErrorCode.AI_INIT_ERR) {
        codeName = 'AI_INIT_ERR';
        } else if (aiError.code >= AIErrorCode.AI_RES_ERR) {
        codeName = 'AI_RES_ERR';
        } else if (aiError.code >= AIErrorCode.AI_SERVER_ERR) {
        codeName = 'AI_SERVER_ERR';
        } else if (aiError.code >= AIErrorCode.AI_API_ERR) {
        codeName = 'AI_API_ERR';
        } else if (aiError.code > AIErrorCode.UNKNOWN_ERR) {
        //0 ~ 9999
        codeName = 'BACKEND_ERR';

        if (aiError.code == 1402) {
            //invalid or token expired
            refreshTokenIFExpired();
        }
        }

    console.log('onAIPlayerErrorV2', aiError.code, codeName, aiError.message);
    };
}

// =========================== AIPlayer Function ================================ //

async function speak(text, gst) {
    await refreshTokenIFExpired();

    console.log("Gesture: " + gst + " Speaking: ", text);
    AI_PLAYER.send({ text: text, gst: gst });

    // if(isPreloadMessage(text))
    // {
    //     AI_PLAYER.send({ text: text, gst: gst });
    // }
    // else
    // {
    //     var msgToSpeak = breakdownSpeak(text);
    //     AI_PLAYER.send(msgToSpeak);
    // }
}

async function preload(clipSet) {
    await refreshTokenIFExpired();

    AI_PLAYER.preload(clipSet);
}

function pause() {
    AI_PLAYER.pause();
}

function resume() {
    AI_PLAYER.resume();
}

function stop() {
    AI_PLAYER.stopSpeak();
}

// =========================== ETC ================================ //

// sample Server request function
async function makeRequest(method, url, params) {
    const options = {
    method,
    headers: { "Content-Type": "application/json; charSet=utf-8" },
    };

    if (method === "POST") options.body = JSON.stringify(params || {});

    return fetch(url, options)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
        console.error("** An error occurred during the fetch", error);
        return undefined;
    });
}

// // Preload messages
// // To move botMessages into another script for editing
// function preloadMessages() {
//     // Multi Gesture preload
//     let preloadArr = []; // Initialize an empty array
//     let obj;

//     // Loop through the dictionary to create array of objects to preload
//     for (const key in botMessages) {
//         if (botMessages.hasOwnProperty(key)) {
//             const value = botMessages[key];
//             if (Array.isArray(value)) {
//                 // If the value is an array, loop through its elements
//                 value.forEach(async (item, index) => {
//                     obj = {text: item.message, gst: item.gesture};
//                     preloadArr.push(obj);
//                 });
//             } else {
//                 obj = {text: value.message, gst: value.gesture};
//                 preloadArr.push(obj);
//             }
//         }
//     }

//     // Preload the array
//     AI_PLAYER.preload(preloadArr);
// }

function preloadMessages(messages) {
    let preloadArr = [];
    console.log(messages);

    if (Array.isArray(messages)) {
        // If it's a flat array of AI_Message
        messages.forEach(item => {
            preloadArr.push({ text: item.message, gst: item.gesture });
        });
    } else {
        // If it's a dictionary
        for (const key in messages) {
            if (messages.hasOwnProperty(key)) {
                const value = messages[key];

                if (Array.isArray(value)) {
                    value.forEach(item => {
                        preloadArr.push({ text: item.message, gst: item.gesture });
                    });
                } else {
                    preloadArr.push({ text: value.message, gst: value.gesture });
                }
            }
        }
    }

    totalMessages = preloadArr.length;

    // Preload the array
    AI_PLAYER.preload(preloadArr);
}

// Count preload messages
function countPreloadMessages(){
    // Loop through the dictionary
    for (const key in botMessages) {
        if (botMessages.hasOwnProperty(key)) {
            const value = botMessages[key];
            if (Array.isArray(value)) {
                // If the value is an array, loop through its elements
                value.forEach(async (item, index) => {
                    totalMessages++;
                });
            } else {
                totalMessages++;
            }
        }
    }
    console.log("Finished counting number of preload messages");
}

const PRELOAD_FINISHED = new Event("PRELOAD_FINISHED");

// Increment the number of messages that are preloaded
function incrementPreloadCount() {
    preloadCount++;
}

// Check if preload finished
function isPreloadingFinished() {
    console.log("Preloaded " + preloadCount + " number of messages...");
    console.log("Checking if preloaded finish against " + totalMessages + " items ...");
    if (preloadCount >= totalMessages) {
        console.log("Dispatching event PRELOAD_FINISHED");
        document.dispatchEvent(PRELOAD_FINISHED);
        return true;
    } else {
        return false;
    }
}

function registerNextSpeak(speak){
    isNextSpeakRegistered = true;
    nextSpeak = speak;
}

function breakdownSpeak(msg){
    // Split by '.', '!', '?' followed by a space or end of string
    return msg.match(/[^.!?]+[.!?]+/g) || [msg];
}

function isPreloadMessage(msg){
    for (const key in botMessages) {
        const botMessage = botMessages[key];

        if (Array.isArray(botMessage)) {
            // If it's an array, check each message inside
            if (botMessage.some(m => m.message === msg)) {
                return true;
            }
        } else if (botMessage.message === msg) {
            return true;
        }
    }
    return false;
}

// Function to use when preload times out in milliseconds
function checkTimeOut(EVENT, timeout, message) {
    console.log('Setting timeout for ' + timeout + ' ms');
    currTimeout = setTimeout( function() {
        console.log("FUNCTION TIMEOUT : " + message);
        document.dispatchEvent(EVENT);
    }, timeout);
}

function setLanguage (lang) {
    // showCustomVoice();
    var customVoice = AI_PLAYER.findCustomVoice(englishFemaleVoice);
    // docLangauge = document.getElementById('langSelector').value;
    console.log("lang = " + lang);
    if (aiLanguages.has(lang)) {
        switch (lang) {
            case 'en':
                customVoice = AI_PLAYER.findCustomVoice(englishFemaleVoice);
            break;
            case 'zh':
                customVoice = AI_PLAYER.findCustomVoice(chineseFemaleVoice);
            break;
        }
    }
    
    const isSuccess = female_Avatar ? AI_PLAYER.setCustomVoice(customVoice) : AI_PLAYER.setCustomVoice(englishMaleVoice); 
    console.log(isSuccess ? "Successfully set custom voice" : "Unsuccessful in setting custom voice");
    
    const customVoice_check = AI_PLAYER.getCustomVoice();
    if (customVoice_check == null) {
        console.log("custom voice is not set");
    }
}

export default { initAvatar, speak, preload, pause, stop, resume, setLanguage };