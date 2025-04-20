export const steps = [
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