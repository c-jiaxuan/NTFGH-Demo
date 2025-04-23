let BTN_HELP = new Event('BTN_HELP');

// Locate help-button
var helpButtonElement = document.getElementById('help-button');

helpButtonElement.addEventListener('click', () => {
    document.dispatchEvent(BTN_HELP);
});

// Pop-up of the chatbot


// Pop-up of the live chat screen