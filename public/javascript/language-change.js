var currentLanguage = 'en-EN';

const selector = document.getElementById('langSelector');

function changeLanguage(languageCode) {
    if (languageCode != null) {
        currentLanguage = languageCode;
        Array.from(document.getElementsByClassName('lang')).forEach(function (elem) {
            if (elem.classList.contains('lang-' + languageCode)) {
                elem.style.display = 'initial';
            }
            else {
                elem.style.display = 'none';
            }
        });
    }
}

// select handler
document.addEventListener(LANGUAGE_CHANGE, function (evt) {
    changeLanguage(evt.detail.language);
});

// detect initial browser language
const lang = navigator.userLanguage || navigator.language || 'en-EN';
const startLang = Array.from(selector.options).map(opt => opt.value).find(val => lang.includes(val)) || 'en';
changeLanguage(startLang);

// updating select with start value
selector.selectedIndex = Array.from(selector.options).map(opt => opt.value).indexOf(startLang)