// In the future create a class object to store data about each individual page
// Use arrays/something to store flow of pages and user progress

// Variables to store user inputs
let patient_maritalStatus = null;
let patient_religion = null;
let patient_language = null;
let patient_education = null;
// let patient_userTimeSlot = [];
let delivery_items = [];

let main_menu_screen = document.getElementById('main-menu-options-div');

let current_display_screen = main_menu_screen;

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
function startPatientAssessment() {
    document.getElementById('landing-screen').classList.add('hidden');
    document.getElementById('patient-assessment-div').classList.remove('hidden');
    document.getElementById('main-menu-button').classList.remove('hidden');
}

function goToMainMenu() {
    // Reset all variables
    patient_maritalStatus = null;
    patient_religion = null;
    patient_language = null;
    patient_education = null;
    
    // Set back currently displayed to main menu
    current_display_screen = document.getElementById('main-menu-options-div');

    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

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

    document.getElementById('main-menu-options-div').classList.remove('hidden');
    document.getElementById('admission-services-div').classList.add('hidden');

    document.getElementById('patient-assessment-div').classList.add('hidden');

    updateHeaderAndSubtitle('en', 'Welcome to Ng Teng Fong General Hospital', 'What can I do for you today?');
    updateHeaderAndSubtitle('zh', '欢迎来到黄廷方综合医院', '今天我能为您做些什么？');
}

function showChatInterface() {
    console.log("show AI Chat");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');

    current_display_screen = document.getElementById('chat-container');
}

function showPatientOrientation() {
    console.log("show patient orientation");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('patient-orientation-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');

    // Set current displayed screen to be patient orientation screen
}

function showDeliveryScreen() {
    console.log("show delivery screen");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('container').classList.add('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('delivery-screen-container').classList.remove('hidden');
    document.getElementById('user-options').classList.add('user_options_1');
}

function showAdmissionServicesScreen() {
    console.log("show admission services");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('main-menu-options-div').classList.add('hidden');
    document.getElementById('admission-services-div').classList.remove('hidden');

    current_display_screen = document.getElementById('admission-services-div');
    updateHeaderAndSubtitle('en', 'Admission Services', 'Services required for patient onboarding into our hospital.');
    updateHeaderAndSubtitle('zh', '欢迎来到健康加诊所', '患者入住本院所需的服务');
}

function showLangInputSetupScreen() {
    console.log("show admission services");
    document.getElementById('main-menu-button').classList.remove('hidden');
    document.getElementById('chat-container').classList.add('hidden');
    document.getElementById('main-menu-options-div').classList.add('hidden');

    current_display_screen = document.getElementById('admission-services-div');
    updateHeaderAndSubtitle('en', 'Admission Services', 'Services required for patient onboarding into our hospital.');
    updateHeaderAndSubtitle('zh', '欢迎来到健康加诊所', '患者入住本院所需的服务');
}

function showSelectedScreen() {
    // Take in a screen to be shown and hides everything else
    // All options need to be properly grouped for this to work
}

function updateHeaderAndSubtitle(language, titleText, subtitleText) {
    const titles = document.querySelectorAll(`.options-title.lang-${language}`);
    const subtitles = document.querySelectorAll(`.options-subtitle.lang-${language}`);

    titles.forEach(title => {
        title.textContent = titleText;
    });
  
    subtitles.forEach(subtitle => {
        subtitle.textContent = subtitleText;
    });
}
