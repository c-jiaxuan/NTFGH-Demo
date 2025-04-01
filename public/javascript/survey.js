// Variables to store user inputs
let patient_maritalStatus = null;
let patient_religion = null;
let patient_language = null;
let patient_education = null;
// let patient_userTimeSlot = [];
let delivery_items = [];

// Handle the first question
function handleMaritalStatus(response) {
    patient_maritalStatus = response;

    // Hide step 1 and show step 2
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

function handleReligion(religion) {
    patient_religion = religion;

    // Hide step 2 and show step 3
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
}

function handleLanguage(language) {
    patient_language = language;

    // Hide step 3 and show step 4
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-4').classList.remove('hidden');
}

function handleEducation(education) {
    patient_education = education;

    // Hide step 4 and show step 5
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');

    // Generate a personalized message
    const message = generateMessage();
    document.getElementById('output-message').innerText = message;
}

// // Handle time slot selection
// function handleTimeSlot() {
//     const checkboxes = document.querySelectorAll('.time-slot:checked');
//     userTimeSlot = Array.from(checkboxes).map(checkbox => checkbox.value);

//     // Hide step 4 and show result
//     document.getElementById('step-4').classList.add('hidden');
//     document.getElementById('result').classList.remove('hidden');

//     // Generate a personalized message
//     const message = generateMessage();
//     document.getElementById('output-message').innerText = message;
// }

// Generate a personalized message based on user inputs
function generateMessage() {
    let report = "Medical Report:\n";
    
    report += `Marital Status: ${patient_maritalStatus ?? "Not provided"}\n`;
    report += `Religion: ${patient_religion ?? "Not provided"}\n`;
    report += `Preferred Language: ${patient_language ?? "Not provided"}\n`;
    report += `Education Level: ${patient_education ?? "Not provided"}\n`;
    
    return report;
}

// Back Navigation Functions
function goBackToMaritalStatus() {
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
}
function goBackToReligion() {
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}
function goBackToLanguages() {
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('step-3').classList.remove('hidden');
}

function goBackToEducation() {
    document.getElementById('result').classList.add('hidden');
    document.getElementById('step-4').classList.remove('hidden');
}

// Restart the process
function restart() {
    // Reset variables
    patient_maritalStatus = null;
    patient_religion = null;
    patient_language = null;
    patient_education = null;
    // userTimeSlot = [];

    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide all steps and show step 1
    document.getElementById('result').classList.add('hidden');
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
}

// Start the Guided Tour
function startGuidedTour() {
    document.getElementById('landing-screen').classList.add('hidden');
    document.getElementById('step-1').classList.remove('hidden');
    document.getElementById('main-menu-button').classList.remove('hidden');
}

function goToMainMenu() {
    // Reset all variables
    patient_maritalStatus = null;
    patient_religion = null;
    patient_language = null;
    patient_education = null;

    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Hide all steps and the result screen
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    document.getElementById('step-4').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');

    // Hide AI chat
    document.getElementById('chat-container').classList.add('hidden');

    // Hide main menu button
    document.getElementById('main-menu-button').classList.add('hidden');

    // Hide Patient Orientation
    document.getElementById('patient-orientation-container').classList.add('hidden');

    // Hide Delivery Screen
    document.getElementById('delivery-screen-container').classList.add('hidden');

    // Show the landing screen
    document.getElementById('landing-screen').classList.remove('hidden');
    document.getElementById('container').classList.remove('hidden');

    // Remove the additional style that shifts the user_options container upwards
    document.getElementById('user-options').classList.remove('user_options_1');
}

function showChatInterface() {
    console.log("show AI Chat");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');
}

function showPatientOrientation() {
    console.log("show patient orientation");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('patient-orientation-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');
}

function showDeliveryScreen() {
    console.log("show delivery screen");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('delivery-screen-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');
}
