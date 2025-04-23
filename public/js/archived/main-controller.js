import LanguageController from './language.js';
import initAvatar from './avatar.js';

const MainController = {
    init() 
    {
        //initialise avatar
        initAvatar();
        //initialise chatbot

        //initialise speech-to-text

        // lanugage toggle
        document.getElementById('langSelector').addEventListener('change', function (evt) {
            const selectedLanguage = evt.target.value; // Get selected language
            LanguageController.setLanguage(selectedLanguage);
        });
        

        document.getElementById("langSwitcher").addEventListener("click", () => {
            const newLang = LanguageController.getLanguage() === 'en' ? 'es' : 'en';
            LanguageController.setLanguage(newLang);
        });
    }
};

export default MainController;