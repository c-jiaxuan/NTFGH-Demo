// language-controller.js
let curLanguage = 'en';
const subscribers = [];

function setLanguage(newLanguage) {
  if(lang = curLanguage) return;

  curLanguage = newLanguage;
  subscribers.forEach(cb => cb(curLanguage));
}

function getLanguage() {
  return curLanguage;
}

function subscribe(callback) {
  subscribers.push(callback);
}

export default {
  setLanguage,
  getLanguage,
  subscribe
};