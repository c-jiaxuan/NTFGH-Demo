const steps = [
    {
      title: 'Care Team',
      substeps: [
        { title: 'Introduction', type: 'video', src: './vid/care-team-intro.mp4', avatarSpeech: '' },
        { title: 'Use of Two-patient Identifiers', 
            type: 'text-image', 
            content: `You will be given a wristband to verify your identity. To ensure you receive the right treatment at the right place and at the right time, we will ask for your name and NRIC/FIN/Passport no. at the following interactions:
            <ul>
                <li>During registration/discharge/transfer</li>
                <li>Before being examined/treated/given medications or blood products</li>
                <li>Before specimen collection</li>
                <li>When we issue documents to you</li>
            </ul>`, 
            imgSrc: './img/orientation/ID_Card.png' },
        {
          type: 'quiz',
          title: 'Do you have your wristband?',
          content: {
            image: '',
            options: [
              {text: 'Yes', correct: true, response: "", nextQns: true},
              {text: 'No', correct: false, response: "", nextQns: false}
            ]
          }
        },
        {
          type: 'quiz',
          title: 'Is it the correct name and ID number? ',
          content: {
            image: '',
            options: [
              {text: 'Yes', correct: true, response: "", nextQns: false},
              {text: 'No', correct: false, response: "", nextQns: false}
            ]
          }
        }
      ]
    },
    {
      title: 'Nurse Call System',
      substeps: [
        { title: 'Nurse Call System Video', type: 'video', src: './vid/nurse-call-system.mov' },
        {
          type: 'quiz',
          title: 'Which button do you press to call the nurse for help?',
          content: {
            image: '',
            options: [
              {text: 'Red Button', correct: true, response: "", nextQns: false},
              {text: 'Right Button', correct: false, response: "", nextQns: false},
              {text: 'Left Button', correct: false, response: "", nextQns: false},
            ]
          }
        }
      ]
    },
    {
      title: 'Visitation Policy',
      substeps: [
        { title: 'Visiting Hours', type: 'text', 
          content: `The main visiting hours are:<br> 
          <u>Daily:</u>
          12:00PM - 08:00PM
          <br><br>
          Visistors are required to register before entering the wards
          <br> 
          <b>Visitor Management Kiosks</b><br>
          Levels 1 and 2, Tower B
          <br> 
          <b> Visitor Registration Counter</b><br>
          Level 1, Tower B` },

        { title: 'Visitation Policy', type: 'text', 
            content: `First time visitors must register once for the duration of the patient's stay.
            <br>
            <u>Self-Registration</u><br>
            Singaporeans and PRs with an NRIC, Singapore Driving Licence, or Student/Senior EZ-link card can self-register at Visitor Management Kiosks (Level 1&2, Tower B). You'll need the patient's full name, ward (e.g. B5), and bed number.
            <br>
            <img src="./img/orientation/Nametag.png" style="max-height: 130px;"></img>
            <u>Assisted Registration</u><br>
            If you don't have the required info or documents, register at the Visitor Registration Counter (Level 1, Tower B). After registration, scan you NRIC or registation label at the Level 1 gantry to enter the ward.
            ` },
         
        { title: 'Visitation Policy', type: 'text', 
          content: `
          <img src="./img/orientation/Visiting_policy.png" style="max-height: 130px;"></img>
          <ul>
            <li>Two members of the family (apart from the four visitors) may register as caregivers. Caregivers may enter the wards at any time to assist with the care of the patient. Visiting hours will not apply.</li>
            <li>A maximum of two visitors are allowed into other areas such as the Isolation Ward, Kidney Unit, Ambulatory Unit and Endoscopy at any one time during visiting horus.</li>
          ` }, 
      ]
    },
    {
      title: 'Fall Precaution',
      substeps: [
        { title: 'Fall Precaution Video', type: 'video', src: './vid/fall-precaution.mp4' },
        { title: 'Fall Precaution QR', type: 'image', src: './img/orientation/fall-precaution.jpg' }
      ]
    }
  ];
  
  let major = 0;
  let minor = 0;
  let continueTimer = 1;
  let nextQns = false;
  
  const orientationPage = document.getElementById('orientation-page');
  const stepTitle = document.getElementById('step-title');
  const contentBlock = document.getElementById('content-block');
  const acknowledgeBtn = document.getElementById('acknowledge-btn');
  const acknowledgeBtnTxt = acknowledgeBtn.querySelector('.button-text');
  const acknowledgeBtnProgress = acknowledgeBtn.querySelector('.overlay-progress');

  function init()
  {
    major = 0;
    minor = 0;
    orientationPage.style.visibility = "hidden";
  }

  function enable(isEnabled){
    orientationPage.style.visibility = isEnabled ? "visible" : "hidden";
  }
  
  function renderStep() {
    const curMajorStep = steps[major];
    const sub = curMajorStep.substeps[minor];
  
    // Set the title with major step and substep titles with unique IDs
    stepTitle.innerHTML = `<span id="majorStepTitle">${curMajorStep.title} (${minor + 1}/${curMajorStep.substeps.length})</span><br><span style="font-size: 24px;" id="subStepTitle">${sub.title}</span>`;
    contentBlock.innerHTML = '';
    acknowledgeBtn.className = 'action-button-disabled';
  
    // Check for substep types and add corresponding IDs for styling
    if (sub.type === 'text') {
      const p = document.createElement('p');
      p.innerHTML = sub.content;
      p.id = 'textSubstep';  // ID for text type substep
      contentBlock.appendChild(p);
      acknowledgeBtn.className = 'action-button';

    } else if (sub.type === 'image') {
      const img = document.createElement('img');
      img.src = sub.src;
      img.id = 'imageSubstep';  // ID for image type substep
      img.style.maxWidth = '100%';
      contentBlock.appendChild(img);
      acknowledgeBtn.className = 'action-button';
  
    } else if (sub.type === 'text-image') {
      const text = document.createElement('p');
      text.innerHTML = sub.content;
      text.id = 'textImageText';  // ID for text part of text-image substep
      const img = document.createElement('img');
      img.src = sub.imgSrc;
      img.id = 'textImageImg';  // ID for image part of text-image substep
      img.style.maxWidth = '100%';
      contentBlock.appendChild(text);
      contentBlock.appendChild(img);
      acknowledgeBtn.className = 'action-button';
  
    } else if (sub.type === 'video') {
        const video = document.createElement('video');
        video.src = sub.src;
        video.controls = true;
        video.id = 'videoSubstep';  // ID for video type substep
    
        // Create countdown text with background
        const countdownText = document.createElement('div');
        countdownText.classList.add('countdown-text');
        countdownText.style.display = 'flex';
    
        const wrapper = document.createElement('div');
        wrapper.classList.add('video-wrapper');
        wrapper.style.position = 'relative'; // For countdown text position
        wrapper.appendChild(countdownText);
        wrapper.appendChild(video);
        contentBlock.appendChild(wrapper);
    
        // Countdown logic before full screen
        let countdown = 3;
        const countdownInterval = setInterval(() => {
          countdown--;
          countdownText.textContent = "Video is starting in " + countdown;
    
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            setTimeout(() => {
              video.requestFullscreen().catch(() => {});
              video.play();
              countdownText.style.display = 'none';
            }, 500);
          }
        }, 1000);

      video.onended = () => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        acknowledgeBtn.className = 'action-button';
      };
    } else if (sub.type === 'quiz') {
      const quizContainer = document.createElement('div');
      quizContainer.id = 'quizSubstep';
    
      // Title
      // const title = document.createElement('h3');
      // title.textContent = sub.title;
      // quizContainer.appendChild(title);
    
      // Image (optional)
      if (sub.content.image) {
        const img = document.createElement('img');
        img.src = sub.content.image;
        img.alt = 'Quiz Visual';
        img.style.maxWidth = '300px';
        quizContainer.appendChild(img);
      }
    
      // Options
      const optionsWrapper = document.createElement('div');
      optionsWrapper.style.display = 'grid';
      optionsWrapper.style.justifySelf = 'center';
      //optionsWrapper.style.gridTemplateColumns = sub.content.options.length === 2 ? '1fr 1fr' : '1fr 1fr';
      //optionsWrapper.style.gridTemplateColumns = "repeat(2, 1fr)";
      optionsWrapper.style.gap = '10px';
      optionsWrapper.style.marginTop = '20px';
    
      sub.content.options.forEach(opt => {
        //const btn = document.createElement('button');
        const btn = acknowledgeBtn.cloneNode(true);
        btn.className = 'action-button';
        const btnText = btn.querySelector(".button-text");
        btnText.innerHTML = opt.text;

        btn.onclick = () => {
          if (opt.correct) {
            //btn.style.background = '#4CAF50'; // Green for correct
            btn.className = 'action-button correct';
          } else {
            //btn.style.background = '#f44336'; // Red for incorrect
            //btn.disabled = true;
            btn.className = 'action-button wrong';
          }
          acknowledgeBtn.className = "action-button";

          optionsWrapper.childNodes.forEach(child => {
            if(child != btn){
              child.className = 'action-button-disabled';
            }
          })

          //Trigger response

          //skip or no skip
          nextQns = opt.nextQns;
        };
        optionsWrapper.appendChild(btn);
      });
    
      quizContainer.appendChild(optionsWrapper);
      contentBlock.appendChild(quizContainer);
    }

    setCurrentStep(sub.type, major, minor);
  }

function setCurrentStep(type, stepIndex, substepIndex) {
  localStorage.setItem('currentStep', JSON.stringify({ type, stepIndex, substepIndex }));
}

  function handleAcknowledge() {
    const curMajorStep = steps[major];
    const sub = curMajorStep.substeps[minor];

    if(sub.type === "quiz")
    {
      if(nextQns){
        if (minor < curMajorStep.substeps.length - 1) {
          minor++;
        } else {
          if (major < steps.length - 1) {
            major++;
            minor = 0;
          } else {
            alert('Orientation Complete!');
            return;
          }
        }
      }
      else{
        //To change
        major++;
        minor = 0;   
      }
    } else {
      if (minor < curMajorStep.substeps.length - 1) {
        minor++;
      } else {
        if (major < steps.length - 1) {
          major++;
          minor = 0;
        } else {
          alert('Orientation Complete!');
          return;
        }
      }
    }

    let current = 0;
    let percent = (current / continueTimer) * 100;
    acknowledgeBtnProgress.style.width = `${percent}%`;
    acknowledgeBtn.className = "action-button-selected";
    acknowledgeBtnTxt.innerHTML = `Continue in ${continueTimer - current}s`;

    const interval = setInterval(() => {
      current++;
      percent = (current / continueTimer) * 100;
      acknowledgeBtnProgress.style.width = `${percent}%`;

      if (continueTimer - current > 0) {
        acknowledgeBtn.className = "action-button-selected";
        acknowledgeBtnTxt.innerHTML = `Continue in ${continueTimer - current}s`;
      } else {
        clearInterval(interval);
        acknowledgeBtnTxt.innerHTML = 'Acknowledge';
        acknowledgeBtnProgress.style.width = '0%';
        renderStep();
      }
    }, 1000);
  }

export default { steps, init, enable, renderStep, handleAcknowledge }