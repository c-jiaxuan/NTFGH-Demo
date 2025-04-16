import { util_dispatchEvent  } from './utilities.js';

const pageTitle = document.getElementById('concierge-page-title');
const pageDescription = document.getElementById('concierge-page-subtitle');

const conciergePage = document.getElementById('concierge-options');
const conciergePageOptions = document.getElementById('concierge-options-wrapper');

const deliveryPage = document.getElementById('delivery-page');
const deliveryOptions = document.getElementById('delivery-items-wrapper');

const confirmationPage = document.getElementById('confirmation-page');
const confirmationOptions = document.getElementById('confirmed-items-wrapper');

const waitingPage = document.getElementById('waiting-page');
const waitingPageOptions = document.getElementById('waiting-page-wrapper');

const finishedPage = document.getElementById('finished-page');
const finishedPageOptions = document.getElementById('finished-page-wrapper');

let deliveryItemsArray = [];

const defaultBtnColor       = '#0c4c9a';
const defaultBtnColor_hover = '#083060';
const helpBtnColor          = '#d26220';
const helpBtnColor_hover    = '#8d4115';
const confirmBtnColor       = '#27a035';
const confirmBtnColor_hover = '#196321';
const cancelBtnColor        = '#ee2d3a';
const cancelBtnColor_hover  = '#a82029';

let BTN_CONTINUE          = new Event('BTN_CONTINUE');
let BTN_ANSWER_SELECTED   = new Event('BTN_ANSWER_SELECTED');
let BTN_SPEAK             = new Event('BTN_SPEAK');
let BTN_HELP              = new Event('BTN_HELP');
let BTN_BACK              = new Event('BTN_BACK');

var btArea = null;

// First screen when entering concierge services
var currentDisplay = conciergePage;
var currentDisplayWrapper = conciergePageOptions;

export function handleContinue() {
    if (currentDisplay == deliveryPage) {
        renderConfirmationScreen();
    } else if (currentDisplay == confirmationPage) {
        renderWaitingScreen();
    } else if (currentDisplay == finishedPage) {
        renderConciergeScreen();
    }
}

export function renderDeliveryScreen() {
    pageTitle.innerText = 'Delivery';
    pageDescription.innerText = 'Please select what you require to be delivered.';

    clearUpdateDisplay(deliveryPage);

    createDeliveryItem('Blankets', './img/concierge/blankets.png');
    createDeliveryItem('Snacks', './img/concierge/biscuits.png');
    createDeliveryItem('Toiletries & Hygiene', './img/concierge/supplies.png');
    createDeliveryItem('Entertainment', './img/concierge/magazines.png');

    createSpeakButton();
    createHelpButton();
    createContinueButton();
}

function renderConfirmationScreen() {
    pageTitle.innerText = 'Delivery';
    pageDescription.innerText = 'Please confirm the items you require to be delivered.';

    clearUpdateDisplay(confirmationPage);

    const confirmedItemsImage = document.createElement('div');
    
    const img = document.createElement('img');
    img.src = './img/concierge/biscuits.png';
    img.style.height = '100%';
    img.style.width = '100%';
    img.style.objectFit = 'cover';

    const name = document.createElement('h1');
    name.innerText = 'Snacks';
    name.style.height = '100%';
    name.style.width = '100%';

    confirmedItemsImage.append(img);
    confirmedItemsImage.append(name);

    confirmationOptions.append(confirmedItemsImage);

    createBackButton();
    createContinueButton();
}

function renderWaitingScreen() {
    pageDescription.innerText = 'Please wait while your items are being delivered.';

    clearUpdateDisplay(waitingPage);

    const img = document.createElement('img');
    img.src = './img/concierge/delivery.png';
    img.style.height = '100%';
    img.style.width = 'auto';
    img.style.objectFit = 'fit';

    waitingPageOptions.append(img);

    // Show delivery complete after some seconds
    setTimeout(() => {
        renderFinishedScreen();
    }, 6000);
}

function renderFinishedScreen() {
    pageDescription.innerText = 'Items have been delivered. Please check and confirm the delivered items.';

    clearUpdateDisplay(finishedPage);

    const img = document.createElement('img');
    img.src = './img/concierge/tick.png';
    img.style.height = '100%';
    img.style.width = 'auto';
    img.style.objectFit = 'fit';

    finishedPageOptions.append(img);

    createButton('cancel-button', 'No, items are missing', '否，商品缺失', cancelBtnColor, cancelBtnColor_hover, '', BTN_BACK);
    createButton('confirmed-button', 'Confirm', '确认', confirmBtnColor, confirmBtnColor_hover, '', BTN_CONTINUE);
}

function renderConciergeScreen() {
    pageTitle.innerText = 'Concierge Services';
    pageDescription.innerText = 'Services provided for paitients during their stay.';

    if (currentDisplay != null) {
        currentDisplay.classList.add('hidden');
    }
    // Show delivery screen
    conciergePage.classList.remove('hidden');
    currentDisplay = conciergePage;
}

// Removes all created elements to make room for next screen
function clearElements(div) {
    if (div != null && div != conciergePageOptions) {
        while (div.hasChildNodes()) {
            div.removeChild(div.firstChild);
        }
        util_dispatchEvent(new Event('SCREEN_CLEARED'));
    }
}

function clearUpdateDisplay(screen) {
    if (currentDisplay != null) {
        const contentDiv = screen.children[0];
        btArea = screen.querySelector('#btn-div');
        clearElements(contentDiv);
        clearElements(btArea);
        currentDisplay.classList.add('hidden');
    }
    currentDisplay = screen;
    btArea = currentDisplay.querySelector('#btn-div');
    screen.classList.remove('hidden');
}

function createDeliveryItem(name, image) {
    const itemDiv = document.createElement('div');
    itemDiv.style.background = '#0c4c9a';
    itemDiv.style.borderradius = '20px';
    itemDiv.style.outline = 'rgb(39, 160, 53)';
    // itemDiv.style.boxSizing = 'border-box'
    itemDiv.style.width = '350px';
    itemDiv.style.height = '250px';
    itemDiv.style.position = 'relative';
    itemDiv.style.overflow = 'hidden';
    itemDiv.style.borderRadius = '10px';

    const rectangle = document.createElement('div');
    rectangle.style.background = '#d0f2ff';
    rectangle.style.width = '350px';
    rectangle.style.height = '200px';
    rectangle.style.position = 'absolute';
    rectangle.style.left = '0px';
    rectangle.style.top = '0px';

    const img = document.createElement('img');
    img.src = image;
    img.style.width = '250px';
    img.style.height = '190px';
    img.style.position = 'absolute';
    img.style.left = '39px';
    img.style.top = '4px';
    img.style.objectfit = 'cover';
    img.style.aspectratio = '172.62/127';

    const itemName = document.createElement('div');
    itemName.innerText = name;
    itemName.style.color = '#ffffff';
    itemName.style.textalign = 'center';
    itemName.style.fontfamily = 'Inter-Regular';
    itemName.style.fontsize = '48px';
    itemName.style.fontweight = '800';
    itemName.style.position = 'absolute';
    itemName.style.left = '0px';
    itemName.style.top = '200px';
    itemName.style.width = '350px';
    itemName.style.height = '50px';
    itemName.style.display = 'flex';
    itemName.style.flexDirection = 'row';
    itemName.style.alignItems = 'center'
    itemName.style.justifyContent = 'center';

    itemDiv.append(rectangle);
    itemDiv.append(img);
    itemDiv.append(itemName);

    deliveryItemsArray.push(itemDiv);

    deliveryOptions.append(itemDiv);

    itemDiv.addEventListener('click', (event) => {
        document.dispatchEvent(new CustomEvent('SELECTED_ITEM'), {
        details: {
            name: name
        }});
        console.log('itemDiv color = ' + itemDiv.style.backgroundColor);
        if (itemDiv.style.backgroundColor == 'rgb(12, 76, 154)') {
            itemDiv.style.backgroundColor = 'rgb(39, 160, 53)';
            itemDiv.style.outline = '12px solid rgb(39, 160, 53)';
        } else {
            itemDiv.style.backgroundColor = 'rgb(12, 76, 154)';
            itemDiv.style.outlineWidth = '0px';
        }
        
        console.log('Dispatching event from : ' + name);
    });

    return itemDiv;
}

function createSpeakButton() {
    createButton('speak-button', 'Speak', '说', '', '', './img/icon/speaking-icon.png', BTN_SPEAK);
}

function createHelpButton() {
    createButton('help-button', 'Help', '帮助', helpBtnColor, helpBtnColor_hover, './img/icon/question_icon.png', BTN_HELP);
}

function createBackButton() {
    createButton('back-button', 'Back', '返回', '', '', './img/icon/back-icon.png', BTN_BACK);
}

function createContinueButton() {
    createButton('continue-button', 'Continue', '继续', confirmBtnColor, confirmBtnColor_hover, '', BTN_CONTINUE);
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
    const bt_enText = document.createElement('p');
    bt_enText.classList.add('lang');
    bt_enText.classList.add('lang-en');
    bt_enText.style.display = 'initial';
    bt_enText.style.display = 'flex';
    bt_enText.style.flexDirection = 'column';
    bt_enText.style.justifyContent = 'center';
    bt_enText.style.width = '100%';
    bt_enText.textContent = eng_text;

    // const bt_cnText = document.createElement('p');
    // bt_cnText.classList.add('lang');
    // bt_cnText.classList.add('lang-zh');
    // bt_cnText.style.display = 'none';
    // bt_cnText.style.display = 'flex';
    // bt_cnText.style.flexDirection = 'column';
    // bt_cnText.style.justifyContent = 'center';
    // bt_cnText.style.width = '100%';
    // bt_cnText.textContent = cn_text;
    bt_textDiv.append(bt_enText);
    // bt_textDiv.append(bt_cnText);

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