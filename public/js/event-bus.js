// event-bus.js
export const Events = {
    HOME_PRESS: 'app:home-pressed',
    SETTING_PRESS: 'app:setting-pressed',
    UPDATE_LANGUAGE: 'app:update-language',
    UPDATE_INPUTMODE: 'app:update-inputmode',
};
  
export const EventBus = {
    on: (eventName, handler) => window.addEventListener(eventName, handler),
    off: (eventName, handler) => window.removeEventListener(eventName, handler),
    emit: (eventName, detail) =>
        window.dispatchEvent(new CustomEvent(eventName, { detail })),
};