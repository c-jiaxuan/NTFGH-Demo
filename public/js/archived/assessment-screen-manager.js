// Make functions that are able to create elements:
// 1) Buttons
// 2) Assessment Screens

// Testing data
let testQuestion = 'What is your marital status?';
let testAnswers = ['Single', 'Married', 'Divorced', 'Widowed', 'Unknown'];

let testOpenQuestions = ['Name', 'Address', 'Religion', 'Home Number', 'Mobile Number', 'Comments'];

const defaultBtnColor       = "#0c4c9a";
const defaultBtnColor_hover = "#083060";
const helpBtnColor          = "#d26220";
const helpBtnColor_hover    = "#8d4115";
const confirmBtnColor       = "#27a035";
const confirmBtnColor_hover = "#196321";

let BTN_CONTINUE          = new Event('BTN_CONTINUE');
let BTN_ANSWER_SELECTED   = new Event('BTN_ANSWER_SELECTED');
let BTN_SPEAK             = new Event('BTN_SPEAK');
let BTN_HELP              = new Event('BTN_HELP');
let BTN_BACK              = new Event('BTN_BACK');

let COUNTDOWN_FINISHED          = new Event('COUNTDOWN_FINISHED');
let ASSESSMENT_SCREEN_CLEARED   = new Event('ASSESSMENT_SCREEN_CLEARED');

// is anything being shown?
var currDisplayedAssessment = false;

// Events for when Generation of the assessment screen is done
const ASSESSMENT_SCREEN_COMPLETE = new Event('ASSESSMENT_SCREEN_COMPLETE');

// Which div the assessment will be appended to
// This is the div where the Q&A things will be completed under to be hidden/shown
let assessmentContainerDiv = document.getElementById('patient-assessment-div');

let btArea = null;
let continueBtn = null;

// Once 'BTN_CONTINUE' event is triggered, remove all assessment elements for the next screen
document.addEventListener('BTN_CONTINUE', function (event) {
    console.log("Recieved event : " + event.type);
    // removeAssessmentScreen();
});

// Once an answer is selected, a countdown will start
// Once countdown finishes, a function is called which fires an event is fired
document.addEventListener('BTN_ANSWER_SELECTED', function (event) {
    console.log("Recieved event : " + event.type);
    continueBtn = document.getElementById('continue-button');
    startCountdown(3, () => {
        util_dispatchEvent(COUNTDOWN_FINISHED);
    }, continueBtn);
});

// Example usage
// Call either "generateTextAreaScreen()" or "generateAssessmentScreen()" with a title and the parameter
// Followed by "generateButtonArea()" to create the buttons at the bottom of the screen
function testGeneration() {
    generateAssessmentScreen(testQuestion, testAnswers);
    //generateTextAreaScreen('Please fill in your Next-of-Kin (NOK) details', testOpenQuestions);
    generateButtonArea(assessmentContainerDiv);
}

// Creates textArea and textBoxes, but no buttons
function generateTextAreaScreen(title, questions) {
    // If there is an existing assessment screen, clear previous screen first
    if (currDisplayedAssessment) {
        removeAssessmentScreen();
    }

    generateTitle(assessmentContainerDiv, title);
    generateTextArea(assessmentContainerDiv, questions);

    // Assessment screen is now showing something
    currDisplayedAssessment = true;

    util_dispatchEvent(ASSESSMENT_SCREEN_COMPLETE);
}

// Takes in a 'question' for a title
// Takes in an array of strings for 'answers'
function generateAssessmentScreen(question, answers) {
    // If there is an existing assessment screen, clear previous screen first
    if (currDisplayedAssessment) {
        removeAssessmentScreen();
    }
    
    generateTitle(assessmentContainerDiv, question);
    generateAnswers(assessmentContainerDiv, answers);

    // Assessment screen is now showing something
    currDisplayedAssessment = true;

    util_dispatchEvent(ASSESSMENT_SCREEN_COMPLETE);
}

// Creates a div containing buttons at the bottom of the assessment screen
function generateButtonArea(div) {
    createButtonDiv(div);
    createSpeakButton();
    createHelpButton();
    createContinueButton();
}

function createSpeakButton() {
    createButton('speak-button', 'Speak', '说', "", "", './images/images_new/speaking-icon.png', BTN_SPEAK);
}

function createHelpButton() {
    createButton('help-button', 'Help', '帮助', helpBtnColor, helpBtnColor_hover, './images/images_new/question_icon.png', BTN_HELP);
}

function createContinueButton() {
    createButton('continue-button', 'Continue', '继续', confirmBtnColor, confirmBtnColor_hover, "", BTN_CONTINUE);
}

// Title, Information, Questions
function generateTitle(div, question) {
    // Create a div
    const assessmentDiv = document.createElement('div');
    assessmentDiv.style.height = '15%';

    // Add a question element and append it to the above div
    const questionHeader = document.createElement('h1');
    questionHeader.id = 'questionHeader';
    questionHeader.innerHTML = `<h1>${question}</h1>`;
    questionHeader.style.height = '100%';
    assessmentDiv.append(questionHeader);
    
    // Append it to the main div to contain the answers 
    div.append(assessmentDiv);

    return assessmentDiv;
}

// Take in an array of answers
function generateAnswers(div, answers) {
    // For each answer
    // Generate a button and append it to the answers div element
    const answersDiv = document.createElement('div');
    answersDiv.style.height = '75%';
    answersDiv.style.width = '100%';
    answersDiv.style.display = 'flex';
    answersDiv.style.flexDirection = 'column';
    answersDiv.style.overflowY = 'scroll';

    let answerButtons = [];
    for (let i = 0; i < answers.length; i++) {
        var ans_button = document.createElement('button');
        ans_button.innerHTML = answers[i];
        ans_button.id = "ans_button_" + i;
        ans_button.style.height = '132px';
        answerButtons.push(ans_button);
        answersDiv.append(ans_button);
    }

    // Function to handle selection of answers
    answerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove color change from previously selected button
            answerButtons.forEach(b => b.style.backgroundColor = '');
            // Set the selected button's color
            button.style.backgroundColor = confirmBtnColor; // Green for selection
            util_dispatchEvent(new CustomEvent('BTN_ANSWER_SELECTED', {
                details: {
                    selected_ans: button.innerHTML
                }
            }));
            console.log("Selected button " + button.innerHTML);
        });
    });

    div.append(answersDiv);

    return answersDiv;
}

// Creates a div for the buttons to append to at the bottom of the assessment screen
function createButtonDiv(div) {
    const bt_div = document.createElement('div');
    bt_div.style.height = '10%';
    bt_div.style.width = '100%';
    bt_div.style.display = 'flex';
    bt_div.style.flexDirection = 'row';
    bt_div.style.justifyContent = 'space-around';

    div.append(bt_div);

    btArea = bt_div;

    return bt_div;
}

// What type of button is it
// What event will be dispatched?
// Creates a button that can have an icon at the side of the button
// Set event to be sent out
function createButton(id, eng_text, cn_text, color, hover_color, image, EVENT) {
    const bt = document.createElement('button');
    bt.id = id;
   
    // Create image and append it into the button
    if (image) {
        const bt_img = document.createElement('img');
        bt_img.src = image;
        bt_img.alt = 'png';
        bt_img.classList.add('button-icon');
        bt.append(bt_img);
    }

    const bt_textDiv = document.createElement('div');
    bt_textDiv.classList.add('button-text');
    const bt_enText = document.createElement('p');
    bt_enText.classList.add('lang');
    bt_enText.classList.add('lang-en');
    bt_enText.style.display = 'initial';
    bt_enText.textContent = eng_text;

    const bt_cnText = document.createElement('p');
    bt_cnText.classList.add('lang');
    bt_cnText.classList.add('lang-zh');
    bt_cnText.style.display = 'none';
    bt_cnText.textContent = cn_text;
    bt_textDiv.append(bt_enText);
    bt_textDiv.append(bt_cnText);

    // Add the additional class for the acknowledge/help styles
    bt.classList.add('button');
    bt.classList.add('button1');
    bt.style.backgroundColor = color ? color : defaultBtnColor;
    bt.append(bt_textDiv);

    bt.addEventListener("mouseleave", function(event) {   
        event.target.style.backgroundColor = color ? color : defaultBtnColor;
    }, false);
    bt.addEventListener("mouseenter", function(event) {   
        event.target.style.backgroundColor = hover_color ? hover_color : defaultBtnColor_hover;
    }, false);
    bt.addEventListener('click', function(event) {
        util_dispatchEvent(EVENT);
    });

    if (btArea != null) {
        btArea.append(bt);
    }
    
    return bt;
}

// Removes all created elements to make room for next screen
function removeAssessmentScreen(div) {
    if (currDisplayedAssessment) {
        while (div.hasChildNodes()) {
            div.removeChild(div.firstChild);
        }
        util_dispatchEvent(ASSESSMENT_SCREEN_CLEARED);
        currDisplayedAssessment = false;
    }
}

// Creates a div to contain textBoxes
function generateTextArea(div, questions) {
    var textAreaDiv = document.createElement('div');
    textAreaDiv.style.height = '75%';
    textAreaDiv.style.width = '100%';
    textAreaDiv.style.display = 'flex';
    textAreaDiv.style.flexDirection = 'column';
    textAreaDiv.style.overflowY = 'scroll';

    questions.forEach(element => {
        var textBox = createTextBox(element);
        textAreaDiv.append(textBox);
    });

    div.append(textAreaDiv);
}

// Creates a title with a text area underneath it
// Used to capture open-ended answers
function createTextBox(title) {
    var textBoxDiv = document.createElement('div');

    // Append title underneath textAreaDiv
    var textBoxTitle = document.createElement('h3');
    textBoxTitle.innerText = title;
    textBoxTitle.style.fontSize = '24px';
    textBoxDiv.append(textBoxTitle);

    // Append textArea underneath title inside textAreaDiv
    // Create and style textArea
    var textBox = document.createElement('textarea');
    textBox.style.width = '95%';
    textBox.style.backgroundColor = '#f0f0f0'; // slight grey background
    textBox.style.borderRadius = '15px';       // rounded corners
    textBox.style.resize = 'none';             // disable resizing
    textBox.style.padding = '10px';            // optional padding for nicer appearance
    textBox.style.border = '1px solid #ccc';   // optional border
    textBox.style.fontSize = '36px';          // increased font size

    textBoxDiv.append(textBox);

    return textBoxDiv;
}

// Will start a countdown for 'seconds' and run a 'callback' once the timing is finished
// Will update buttonElement with progress bar
function startCountdown(seconds, callback, buttonElement) {
    if (typeof seconds !== "number" || seconds <= 0) {
        throw new Error("Countdown must be a positive number.");
    }
    if (typeof callback !== "function") {
        throw new Error("Callback must be a function.");
    }
    if (!(buttonElement instanceof HTMLElement)) {
        throw new Error("buttonElement must be a valid HTML element.");
    }

    // Clear any existing countdown
    if (buttonElement._countdownIntervalId) {
        clearInterval(buttonElement._countdownIntervalId);
        buttonElement._countdownIntervalId = null;
    }

    // Remove previous progress bar if exists
    if (buttonElement._progressWrapper && buttonElement.contains(buttonElement._progressWrapper)) {
        buttonElement.removeChild(buttonElement._progressWrapper);
    }

    let counter = 0;

    // Ensure button is styled properly
    const buttonStyles = window.getComputedStyle(buttonElement);
    const borderRadius = buttonStyles.borderRadius;
    const buttonBgColor = buttonStyles.backgroundColor || "#fff";

    // Style button container
    buttonElement.style.position = "relative";
    buttonElement.style.overflow = "hidden";

    // Create a wrapper to hold the progress layer
    const progressWrapper = document.createElement("div");
    progressWrapper.style.position = "absolute";
    progressWrapper.style.top = "0";
    progressWrapper.style.left = "0";
    progressWrapper.style.width = "100%";
    progressWrapper.style.height = "100%";
    progressWrapper.style.borderRadius = borderRadius;
    progressWrapper.style.overflow = "hidden";
    progressWrapper.style.zIndex = "0"; // behind button text
    progressWrapper.style.pointerEvents = "none";

    // Create the progress bar
    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = "0%";
    progressBar.style.backgroundColor = "rgba(31, 109, 0, 0.4)";
    progressBar.style.transition = `width ${seconds}s linear`;

    // Apply to DOM
    progressWrapper.appendChild(progressBar);
    buttonElement.appendChild(progressWrapper);

    // Save reference to clean up later
    buttonElement._progressWrapper = progressWrapper;

    // Start animation after layout is done
    requestAnimationFrame(() => {
        progressBar.style.width = "100%";
    });

    // Start countdown interval
    const intervalId = setInterval(() => {
        counter++;
        console.log(`Countdown: ${seconds - counter}`);

        if (counter >= seconds) {
            clearInterval(intervalId);
            buttonElement._countdownIntervalId = null;

            if (buttonElement.contains(progressWrapper)) {
                buttonElement.removeChild(progressWrapper);
            }

            callback();
        }
    }, 1000);

    // Save interval ID for reset handling
    buttonElement._countdownIntervalId = intervalId;
}

// Create another script to handle clicking of the help button
