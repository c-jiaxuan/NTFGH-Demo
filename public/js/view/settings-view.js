import { EventBus, Events } from "../event-bus.js";

const langButtons = document.querySelectorAll('#lang-selector button');
const inputButtons = document.querySelectorAll('#input-selector button');

function init(){
    // Function to handle selection of language
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("button-clicked");
            EventBus.emit(Events.UPDATE_LANGUAGE, button.innerText);
        });
    });

    // Function to handle selection of input method
    inputButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("button-clicked");
            EventBus.emit(Events.UPDATE_INPUTMODE, button.innerText);
        });
    });
}

export default { init }
