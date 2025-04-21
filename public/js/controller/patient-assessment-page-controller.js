import { BasePageController } from './base-page-controller.js';
import { PatientAssessmentView } from '../view/patient-assessment-view.js';
import { AvatarEvents, EventBus, Events } from '../event-bus.js';
import { steps } from './assessment-config.js';
import { ActionBarView } from '../view/action-bar-view.js';
import { ActionBarChatbot } from '../llm/action-bar-chatbot.js';

export class PatientAssessmentPageController extends BasePageController {
  constructor(id){
    const view = new PatientAssessmentView(id);
    super(id, view);

    this.actionBar = new ActionBarView('bottom-action-bar');
    this.actionChatbot = new ActionBarChatbot(this.actionBar);

    this.currentStepIndex = 0;
    this.currentStep = steps[this.currentStepIndex];
    this.language = "en";
    this.inputMode = "touch";
    this.isTranscribeActive = false;
    this.allStepSpeech = [];
    this.currentStepSpeak = false;

    this.view.on("readyForAcknowledge", (e) => {
      this.onStepReadyForAcknowledge(e.detail);
    });

    this.actionBar.bindButtonClick(this.handleActionBarClicked.bind(this));
    this.actionBar.on("acknowledgeCountdownComplete", (e) => {
      EventBus.emit(AvatarEvents.STOP, {});
      this.nextStep();
    });

    EventBus.on(Events.UPDATE_LANGUAGE, (e) => { this.onUpdateLanguage(e.detail); })
    EventBus.on(Events.UPDATE_INPUTMODE, (e) => { this.onUpdateInputMode(e.detail); })
    EventBus.on(AvatarEvents.SPEAK_COMPLETED, (e) => { this.onAvatarSpeakCompleted(e.detail); })

  }

  startAssessment(){
    this.currentStepIndex = 0;
    this.currentStepSpeak = false;
    this.currentStep = steps[this.currentStepIndex];

    this.showCurrentStep();

    this.actionBar.show();
    this.actionBar.showHelpBtn(true);
    this.actionBar.showAcknowledgeBtn(true);
  }

  onUpdateLanguage(language){
    this.language = language;

    const step = steps[this.currentStepIndex];
    this.buildSpeechListFromSteps(steps);
    this.currentStepSpeak = false;
    this.showCurrentStep();
  }

  onUpdateInputMode(mode){
    console.log(mode);
    this.inputMode = mode;

    this.showCurrentStep();

    if(this.inputMode == "voice")
      {
        document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
          detail: { language: 'en-US', timeout: steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl" }
        }));
        this.isTranscribeActive = true;     
      }
      else{
        if(this.isTranscribeActive)
        {
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }
      }
  }

  onAvatarSpeakCompleted(e) {
    //First speech
    if(this.currentStepSpeak == false)
    {
      this.currentStepSpeak = true;

      if(this.inputMode == "voice")
      {
        document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
          detail: { language: 'en-US', timeout: steps[this.currentStepIndex].type === "next-of-kin" || steps[this.currentStepIndex].type === "adl" }
        }));
        this.isTranscribeActive = true;     
      }
      else{
        if(this.isTranscribeActive)
        {
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }
      }
    }
  }

  onStepReadyForAcknowledge(e){
    this.actionBar.enableAcknowledgeBtn(true);

    //For video
    if(this.language == "zh")
    {
      if(this.currentStepIndex == 2)
        {
          EventBus.emit(AvatarEvents.SPEAK, { message: "用户表示他们可以独立进食，但有时需要帮助喝水，这表明他们在进食方面需要一些帮助，但不需要完全的协助。因此，选择的选项是“需要协助”。", gesture: "" } );
        }
    
        if(this.currentStepIndex == 3)
        {
          EventBus.emit(AvatarEvents.SPEAK, { message: "用户表示他们的腿部无力，如果独自洗澡可能会跌倒，这表明他们需要完全的协助。因此，选择的选项是“依赖”。", gesture: "" } );
        }
    }

    if(this.inputMode == 'voice')
    {
      document.dispatchEvent(new CustomEvent('aws-start-transcribe', {
        detail: { language: 'en-US', timeout: false }
      }));
      this.isTranscribeActive = true;
    }
  }
  
  handleActionBarClicked(key){
    if(!this.isActive) return;
    
    switch (key){
      case "back":
        if(this.inputMode == "voice"){
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }

        this.previousStep();
        break;
      case "help":
        break;
      case "acknowledge":
        if(this.inputMode == "voice"){
          document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
            detail: { language: 'en-US' }
          }));
          this.isTranscribeActive = false;
        }

        this.actionBar.countdownAcknowledgeBtn(1, true);
        break;
    }
  }

  showCurrentStep() {
    if(!this.isActive) return;

    document.dispatchEvent(new CustomEvent('aws-reset-transcribe', {
      
    }));

    const step = steps[this.currentStepIndex];
    console.log(this.currentStepSpeak);
    if(!this.currentStepSpeak) this.speakStep(this.currentStepIndex);

    this.actionBar.showBackBtn(this.currentStepIndex > 0);
    this.actionBar.enableAcknowledgeBtn(false);

    this.view.renderStep(this.language, step);
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
        const label = typeof option === 'object' ? option[this.language] : option;
        return transcript.includes(this.normalize(label));
      });

      if (matched) {
        const label = typeof matched === 'object' ? matched[this.language] : matched;
        
        // Find and click the matching button in DOM
        const buttons = document.querySelectorAll('.option-button');
        for (const btn of buttons) {
          if (this.normalize(btn.textContent) === this.normalize(label)) {
            btn.click();
            console.log(`✅ Matched and selected: ${label}`);
            break;
          }
        }
      }
    }  

    this.actionChatbot.handleTranscript(e.detail);
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

    document.addEventListener("aws-transcribe-update", this.handleTranscribeEvent.bind(this));
    document.addEventListener("aws-transcribe-complete", this.handleTranscribeComplete.bind(this));

  }

  onExit() {
    super.onExit();
    console.log('Leaving Patient Assessment page');
    // Cleanup, stop audio, etc.
    this.actionBar.hide();
    
    document.dispatchEvent(new CustomEvent('aws-stop-transcribe', {
      detail: { language: 'en-US' }
    }));

    document.removeEventListener("aws-transcribe-update", this.handleTranscribeEvent);
    document.removeEventListener("aws-transcribe-complete", this.handleTranscribeComplete);
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

    return `You should select option ${choice} because ${reason}`;
  }

  //To be put in a separated script
  async extractInfoFromSpeech(transcript) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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" // ← Replace with your key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Extract the next-of-kin details from the user's sentence: name, relationship, phone number, and address. Return only a JSON object with keys: name, relationship, phone_number, address."
            },
            {
              role: "user",
              content: transcript
            }
          ],
          temperature: 0,
          max_tokens: 150
        })
      });
  
      const data = await response.json();
      const resultText = data.choices[0].message.content;
  
      return JSON.parse(resultText);
    } catch (err) {
      console.error("❌ GPT Extraction Failed:", err);
      EventBus.emit(AvatarEvents.SPEAK, {message:"I am not sure what you have sent, please try again.", gesture: ""});
      return null;
    }
  }

  buildSpeechListFromSteps(steps) {
    this.allStepSpeech = steps.map((step) => {
      const lang = this.language;
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
}