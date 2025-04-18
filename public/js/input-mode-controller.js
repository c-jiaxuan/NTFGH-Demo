let inputMode = 'touch';
const subscribers = [];

function setInputMode(mode){
    if(mode==inputMode) return;

    inputMode = mode;
    subscribers.forEach(cb => cb(inputMode));
}

function getInputMode(){
    return inputMode;
}

function subscribe(callback){
    subscribers.push(callback);
}

export default {
    setInputMode,
    getInputMode,
    subscribe
};