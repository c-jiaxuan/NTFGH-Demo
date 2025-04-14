// language.js
const LanguageController = (() => {
    let currentLang = 'en';
    const subscribers = [];
  
    function setLanguage(lang) {
      if (lang !== currentLang) {
        currentLang = lang;
        notifySubscribers(lang);
      }
    }
  
    function getLanguage() {
      return currentLang;
    }
  
    function subscribe(callback) {
      subscribers.push(callback);
    }
  
    function notifySubscribers(lang) {
      subscribers.forEach(fn => fn(lang));
    }
  
    return {
      setLanguage,
      getLanguage,
      subscribe
    };
  })();