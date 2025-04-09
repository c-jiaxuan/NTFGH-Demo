// Get elements
const langButtons = document.querySelectorAll('#init-Lang-selector-div button');
const inputButtons = document.querySelectorAll('#init-input-selector-div button');
const confirmButton = document.getElementById('init-lang-input-confirm-button');
const overlay = document.getElementById('lang-input-selector-div'); // Overlay element

let selectedLang = null;
let selectedInput = null;

// Function to handle selection of language
langButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove color change from previously selected button
        langButtons.forEach(b => b.style.backgroundColor = '');
        // Set the selected button's color
        button.style.backgroundColor = '#4CAF50'; // Green for selection
        // Store the selected language
        selectedLang = button.innerText;
        toggleConfirmButton();
    });
});

// Function to handle selection of input method
inputButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove color change from previously selected button
        inputButtons.forEach(b => b.style.backgroundColor = '');
        // Set the selected button's color
        button.style.backgroundColor = '#4CAF50'; // Green for selection
        // Store the selected input method
        selectedInput = button.innerText;
        toggleConfirmButton();
    });
});

// Toggle the "Confirm" button based on selections
function toggleConfirmButton() {
    if (selectedLang && selectedInput) {
        confirmButton.disabled = false;
        confirmButton.style.backgroundColor = '#0c4c9a'; // Green when enabled
    } else {
        confirmButton.disabled = true;
        confirmButton.style.backgroundColor = '#d3d3d3'; // Grey when disabled
    }
}

// Initial state: "Confirm" button is disabled
confirmButton.disabled = true;
confirmButton.style.backgroundColor = '#d3d3d3'; // Greyed out initially

// Hide the overlay when "Confirm" is clicked
confirmButton.addEventListener('click', () => {
    // Hide the overlay by setting display to none
    overlay.style.display = 'none';
});