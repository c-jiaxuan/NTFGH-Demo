import { BasePageController } from './base-page-controller.js';
import { PatientAssessmentView } from '../view/patient-assessment-view.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { steps } from './assessment-config.js';
import { ActionBarController } from './action-bar-controller.js';
import { appSettings } from '../appSettings.js';


export class PatientAssessmentPageController extends BasePageController {
  constructor(id){
    const view = new PatientAssessmentView(id);
    super(id, view);

    //action bar of the page
    this.actionBar = new ActionBarController('bottom-action-bar');

    this.currentStepIndex = 0;
    this.currentStep = steps[this.currentStepIndex];
    this.isTranscribeActive = false;
    this.allStepSpeech = [];
    this.currentStepSpeak = false;
  }

  start(){
    this.currentStepIndex = 0;
    this.currentStepSpeak = false;
    this.currentStep = steps[this.currentStepIndex];

    document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
      detail: { language: appSettings.language, timeout: false }
    }));

    this.showCurrentStep();
  }

  onUpdateLanguage(language){
    const step = steps[this.currentStepIndex];
    this.buildSpeechListFromSteps(steps);
    this.currentStepSpeak = false;
    this.showCurrentStep();
  }

  onUpdateInputMode(mode){
    console.log(mode);

    this.showCurrentStep();

    if(appSettings.inputMode == "voice")
      {
        this.setupTranscribeForVoiceCommmand(true, steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl");
        this.isTranscribeActive = true;     
      }
      else{
        if(this.isTranscribeActive)
        {
          this.setupTranscribeForVoiceCommmand(false);
          this.isTranscribeActive = false;
        }
      }
  }

  onAvatarSpeakCompleted(e) {
    //First speech
    if(this.currentStepSpeak == false)
    {
      this.currentStepSpeak = true;

      if(appSettings.inputMode == "voice")
      {
        this.setupTranscribeForVoiceCommmand(true, steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl");

        this.isTranscribeActive = true;     
      }
      else{
        if(this.isTranscribeActive)
        {
          this.setupTranscribeForVoiceCommmand(false);

          this.isTranscribeActive = false;
        }
      }
    }
  }

  onStepReadyForAcknowledge(e){
    if(appSettings.inputMode == 'voice')
    {
      this.setupTranscribeForVoiceCommmand(false);

      this.isTranscribeActive = true;
    }

    this.actionBar.enableAcknowledge(true);
  }
  
  handleActionBarClicked(key){
    if(!this.isActive) return;
    
    switch (key){
      case "back":
        if(appSettings.inputMode == "voice"){
          this.setupTranscribeForVoiceCommmand(false);

          this.isTranscribeActive = false;
        }

        this.previousStep();
        break;
      case "help":
        this.showCurrentStep();
        if(appSettings.inputMode == "voice")
          {
            this.setupTranscribeForVoiceCommmand(true, steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl");

            this.isTranscribeActive = true;     
          }
          else{
            if(this.isTranscribeActive)
            {
              this.setupTranscribeForVoiceCommmand(false);

              this.isTranscribeActive = false;
            }
          }

        break;
      case "acknowledge":
        if(appSettings.inputMode == "voice"){
          this.setupTranscribeForVoiceCommmand(false);

          this.isTranscribeActive = false;
        }

        this.actionBar.countdownAcknowledgeBtn(true);
        break;
    }
  }

  showCurrentStep() {
    if(!this.isActive) return;

    //Clear user bubble to ready for next step
    EventBus.emit(Events.CHAT_UPDATE, { otherText: "" });


    document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {

    }));

    const step = steps[this.currentStepIndex];
    console.log(this.currentStepSpeak);
    if(!this.currentStepSpeak) this.speakStep(this.currentStepIndex);

    this.actionBar.update(this.currentStepIndex > 0, true, true);
    this.actionBar.enableAcknowledge(false);

    this.view.renderStep(appSettings.language, step);
  }

  nextStep() {
    if (this.currentStepIndex < steps.length - 1) {
      this.currentStepIndex++;
      this.currentStepSpeak = false;

      this.showCurrentStep();
    } 
    else
      EventBus.emit(Events.HOME_PRESS);

  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepSpeak = false;

      this.showCurrentStep();
    }
  }

  async handleTranscribeEvent(e){
    console.log("transcribe" + e.detail);

    const step = steps[this.currentStepIndex];

    if(step.type == "assessment")
    {
      const transcript = this.normalize(e.detail);

      if (!step || !step.options) return;

      // Find the matching option in current step
      const matched = step.options.find(option => {
        const label = typeof option === 'object' ? option[appSettings.language] : option;
        return transcript.includes(this.normalize(label));
      });

      if (matched) {
        const label = typeof matched === 'object' ? matched[appSettings.language] : matched;
        
        // Find and click the matching button in DOM
        const buttons = document.querySelectorAll('.option-button');
        for (const btn of buttons) {
          if (this.normalize(btn.textContent) === this.normalize(label)) {
            btn.click();
            console.log(`✅ Matched and selected: ${label}`);

            this.setupTranscribeForVoiceCommmand(false);
            break;
          }
        }
      }
    }  
  }

  // Normalize strings
  normalize(str) {
    return str.toLowerCase().replace(/\s+/g, '');
  }

  onEnter() {
    super.onEnter();
    console.log('Patient Assessment page initialized');

    // Run animations, load data, start timers, etc.
    this.buildSpeechListFromSteps(steps);

    //Show actionbar together with it
    this.actionBar.show();

    //Listen to its own view event
    this.view.on("readyForAcknowledge", (e) => {
      this.actionBar.enableAcknowledge(true);
    });

    this.view.on("quizAnswered", (e) => {
      this.onQuizAnswered(e.detail);
    })

    //Listen to action bar controller event
    this.actionBar.on("acknowledged", (e) => {
      EventBus.emit(AvatarEvents.STOP, {});
      this.nextStep();
    });

    this.actionBar.on("action-button-clicked", (e) => { 
      this.handleActionBarClicked(e.detail);
    })

    document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
    document.addEventListener("aws-transcribe-complete", this.handleTranscribeComplete.bind(this));

    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
    EventBus.on(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })
  }

  onExit() {
    super.onExit();
    console.log('Leaving Patient Assessment page');

    //Hide the action bar together with it
    this.actionBar.hide();

    //Remove listen to its own view event
    this.view.off("readyForAcknowledge", (e) => {
      this.actionBar.enableAcknowledge(true);
    });

    this.view.off("quizAnswered", (e) => {
      this.onQuizAnswered(e.detail);
    })

    //Remove listen to action bar controller event
    this.actionBar.off("acknowledged", (e) => {
      this.nextStep();
    });
    this.actionBar.off("action-button-clicked", (e) => { 
      this.handleActionBarClicked(e.detail);
    })

    
    document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      detail: { language: 'en-US' }
    }));

    document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
    document.removeEventListener("aws-transcribe-complete", this.handleTranscribeComplete);

    EventBus.off(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.off(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
    EventBus.off(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })
  }

  async handleTranscribeComplete(e){
    const step = steps[this.currentStepIndex];
    if(step.type != "next-of-kin" && step.type != "adl") return;

    const transcript = this.normalize(e.detail);
    if(transcript == "") return;

    if (step.type === "adl") {
      // Calculate the correct ADL index relative to only ADL-type steps
      const adlIndex = steps
        .slice(0, this.currentStepIndex + 1)
        .filter(s => s.type === "adl").length - 1;
    
      const adlQuestion = window.adl_questions?.[adlIndex];
      if (!adlQuestion) {
        console.warn("ADL question not found for index:", adlIndex);
        return;
      }
    
      const payload = {
        question: adlQuestion.question,
        user_input: transcript,
        choices: adlQuestion.choices
      };
    
      try {
        const response = await fetch("https://voicewebapp.straivedemo.com/classify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });
    
        const data = await response.json();
        const result = data.answer || "";
    
        console.log("🎯 GPT Classification:", data);
    
        const buttons = document.querySelectorAll('.option-button');
        for (const btn of buttons) {
          if (this.normalize(btn.textContent) === this.normalize(data.output.choice)) {
            btn.click();
            console.log(`✅ Auto-selected: ${result}`);

            this.setupTranscribeForVoiceCommmand(false);
            break;
          }
        }

        EventBus.emit(AvatarEvents.SPEAK, { message: this.formatResponse(data), gesture: ""});

      } catch (err) {
        console.error("❌ ADL classify failed:", err);
        EventBus.emit(AvatarEvents.SPEAK, {message:"I am not sure what you have sent, please try again.", gesture: ""});
      }
    }
    else if (step.type == "next-of-kin")
    {
      const result = await this.extractInfoFromSpeech(transcript);
      if (!result) return;

      console.log("✅ Extracted Next-of-Kin Info:", result);

      // Autofill input fields in DOM
      const fillMap = {
        name: result.name,
        relationship: result.relationship,
        phone: result.phone_number,
        address: result.address
      };
  
      const inputs = document.querySelectorAll('.field-layout input');
      inputs.forEach(input => {
        const label = input.name?.toLowerCase();
        for (let key in fillMap) {
          if (label.includes(key)) {
            input.value = fillMap[key] || '';
            break;
          }
        }
      });
  
      // Trigger manual "keyup" event to check completeness
      inputs.forEach(input => input.dispatchEvent(new Event('keyup')));
      this.setupTranscribeForVoiceCommmand(false);
    }
  }

  formatResponse(jsonData) {
    let reason = jsonData.output.reason;
    const choice = jsonData.output.choice;

    // Replace "the user" with "you"
    reason = reason.replace(/\b[Tt]he user\b/g, "you");

    // Replace third-person pronouns with second-person
    reason = reason.replace(/\bthey are\b/g, "you are");
    reason = reason.replace(/\bthey were\b/g, "you were");
    reason = reason.replace(/\bthey have\b/g, "you have");
    reason = reason.replace(/\bthey\b/g, "you");
    reason = reason.replace(/\bthem\b/g, "you");
    reason = reason.replace(/\btheir\b/g, "your");
    reason = reason.replace(/\bthemselves\b/g, "yourself");

    // Fix verb agreement after replacements (very basic handling)
    reason = reason.replace(/\byou needs\b/g, "you need");
    reason = reason.replace(/\byou has\b/g, "you have");

    // Lowercase the first character if needed
    reason = reason.charAt(0).toLowerCase() + reason.slice(1);

    return `I selected option '${choice}' because ${reason}`;
  }

  //To be put in a separated script
  async extractInfoFromSpeech(transcript) {
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript }),
      });
      
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error("❌ GPT Extraction Failed:", err);
      EventBus.emit(AvatarEvents.SPEAK, {message:"I am not sure what you have sent, please try again.", gesture: ""});
      return null;
    }
  }

  buildSpeechListFromSteps(steps) {
    this.allStepSpeech = steps.map((step) => {
      const lang = appSettings.language;
      const q = step.question?.[lang] ?? "";
      
      if (Array.isArray(step.options)) {
        const optionsText = step.options.map(opt => opt[lang] ?? "").join(', ');
        const optionsLabel = lang === 'zh' ? '选项为' : 'Options are';
        return { text: `${q} ${optionsLabel}: ${optionsText}`, gesture: null };
      } else {
        return { text: q, gesture: null };
      }
    });
  
    const speechTexts = this.allStepSpeech.map(item => ({ message: item.text, gesture: item.gesture }));
    EventBus.emit(AvatarEvents.PRELOAD, { detail: speechTexts });
  }

  speakStep(index) {
    if (!this.allStepSpeech[index]) return;
    const line = this.allStepSpeech[index]; 
    console.log(line.text);
    EventBus.emit(AvatarEvents.SPEAK, { message: line.text, gesture: line.gesture } );
  }

  setupTranscribeForVoiceCommmand(enabled, timeout = false){
    if(enabled)
    {
      //Listen to transcribe event
      document.addEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Start transcribing


      document.dispatchEvent(new CustomEvent('aws-update-timeout', {
        detail: { timeout: timeout }
      }));
    }
    else
    {
      //Remove transcribe listener
      document.removeEventListener("aws-transcribe-update", (e) => this.handleTranscribeEvent(e));
      //Stop transcribing
      // document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      //   detail: { language: appSettings.language }
      // }));
      document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
        detail: { }
      }));
    }
  }
  
}