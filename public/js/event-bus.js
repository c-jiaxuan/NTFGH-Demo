// event-bus.js
export const Events = {
    HOME_PRESS: 'app:home-pressed',
    SETTING_PRESS: 'app:setting-pressed',
    UPDATE_LANGUAGE: 'app:update-language',
    UPDATE_INPUTMODE: 'app:update-inputmode',
    GETTING_START_PRESS: 'app:getting-started-pressed',
    START_ORIENTATION: 'main:start-orientation',
    START_PATIENT_ASSESSMENT: 'main:start-assessment',
    START_DELIVERY: 'main:start-deliver',    
};

export const AvatarEvents = {
    PRELOAD: 'avatar:preload',
    PRELOAD_COMPLETED: 'avatar:preload-completed',
    SPEAK: 'avatar:speak',
    SPEAK_COMPLETED: 'avatar:speak-completed',
    STOP: 'avatar:stop'
}
  
export const EventBus = {
    on: (eventName, handler) => window.addEventListener(eventName, handler),
    off: (eventName, handler) => window.removeEventListener(eventName, handler),
    emit: (eventName, detail) =>
        window.dispatchEvent(new CustomEvent(eventName, { detail })),
};