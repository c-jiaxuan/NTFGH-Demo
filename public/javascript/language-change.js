var currentLanguage = 'en-EN';

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
const selector = document.getElementById('langSelector');
selector.addEventListener('change', function (evt) {
    changeLanguage(this.value);
});

// detect initial browser language
const lang = navigator.userLanguage || navigator.language || 'en-EN';
const startLang = Array.from(selector.options).map(opt => opt.value).find(val => lang.includes(val)) || 'en';
changeLanguage(startLang);

// updating select with start value
selector.selectedIndex = Array.from(selector.options).map(opt => opt.value).indexOf(startLang)