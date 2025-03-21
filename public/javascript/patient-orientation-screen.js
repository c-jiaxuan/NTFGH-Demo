// Used to track each step of the patient orientation
let patientOrientation_imgs = ['./images/orientation/or_1.png',
                        './images/orientation/or_2.png',
                        './images/orientation/or_3.png',
                        './images/orientation/or_4.png'
];

let patientOrientation_titles = ['Daily Ward Activities',
                                'Visitation Hours',
                                'Personal Care',
                                'Preventing Falls'
];

var currStep = 0;

// Might need a cooldown (e.g., 30 seconds before allowing user to press acknowledge)

// Fire event for Avatar to narrate page

// Get the title and image that needs to be changed
const patientOrientation_title = document.getElementById('image-title');
const patientOrientation_img = document.getElementById('orientation-image');

function nextStep() {
    if (currStep < (patientOrientation_imgs.length - 1)) {
        // Change image and image title
        currStep++;
        patientOrientation_title.innerHTML = patientOrientation_titles[currStep];
        patientOrientation_img.src = patientOrientation_imgs[currStep];
    }
}

function resetStep() {
    currStep = 0;
    patientOrientation_title.innerHTML = patientOrientation_titles[currStep];
    patientOrientation_img.src = patientOrientation_imgs[currStep];
}

function dispatchAcknowledgeEvent() {
    document.dispatchEvent(new Event('ACKNOWLEDGED'));
}

document.addEventListener('ACKNOWLEDGED', function(evt) {
    // Move to next step after acknowledgement
    nextStep();
});
