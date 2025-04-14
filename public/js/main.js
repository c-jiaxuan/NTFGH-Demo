// // main.js
// import MainController from './javascript/main-controller.js';

// document.addEventListener('DOMContentLoaded', () => {
//   MainController.init();
// });


// main.js
import { init, renderStep, handleAcknowledge } from './orientationController.js';

const acknowledgeBtn = document.getElementById('acknowledge-btn');

// // Make variables globally accessible for renderStep (not ideal for production)
// window.steps = steps;
// window.major = major;
// window.minor = minor;
// window.stepTitle = document.getElementById('stepTitle');
// window.stepCount = document.getElementById('stepCount');
// window.contentBlock = document.getElementById('contentBlock');
// window.acknowledgeBtn = acknowledgeBtn;

// Initial render
init();
renderStep();

// Advance on button click
acknowledgeBtn.addEventListener('click', () => {
  handleAcknowledge();
});
