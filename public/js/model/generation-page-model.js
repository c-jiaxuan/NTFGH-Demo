// model.js

import { appSettings } from '../config/appSettings.js';

export class GenerationPageModel {
    constructor() {
        this.currentStepIndex = 0;
        this.currentStepSpeak = false;
        this.isTranscribeActive = false;
        this.allStepSpeech = [];

        this.GENERATION_TYPES = {
            TXT2IMG: 'txt2img',
            TXT2VID: 'txt2vid',  
            IMG2VID: 'img2vid',
            DOC2VID: 'doc2vid',
            URL2VID: 'url2vid'
        }

        this.generationType = null;
        this.steps = null;

        this.userInput = {};
        this.uploadedImage = null;
        this.uploadedDocument = null;
        this.uploadedUrl = '';
    }

    get currentStep() {
        return this.steps[this.currentStepIndex];
    }

    get hasNextStep() {
        return this.currentStepIndex < this.steps.length - 1;
    }

    get nextStep() {
        if (this.hasNextStep()) {
            this.currentStepIndex++;
        }
        return this.currentStep();
    }

    storeAnswer(key, value) {
        this.userInput[key] = value;
    }

    normalize(str) {
        return str.toLowerCase().replace(/\s+/g, '');
    }

    async convertToBase64Img(image) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                const base64Full = event.target.result;
                // const base64Only = base64Full.replace(/^data:image\/\w+;base64,/, '');
                this.uploadedImage = base64Full;
                console.log('[generation-page-model] Set uploaded file to be: ' + this.uploadedImage);
                resolve(base64Full);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };

            fileReader.readAsDataURL(image);
        });
    }

    buildSpeechListFromSteps() {
        this.allStepSpeech = this.steps.map(step => {
            const lang = appSettings.language;
            const question = step.question?.[lang] || '';
            if (Array.isArray(step.options)) {
                const optionsText = step.options.map(o => o[lang] || '').join(', ');
                const optionsLabel = lang === 'zh' ? '选项为' : 'Options are';
                return { text: `${question} ${optionsLabel}: ${optionsText}`, gesture: null };
            }
            // For fields (textarea), just speak the question
            return { text: question, gesture: 'G02' };
        });
        return this.allStepSpeech.map(item => ({ message: item.text, gesture: item.gesture }));
    }

    formatResponse(jsonData) {
        let reason = jsonData.output.reason;
        const choice = jsonData.output.choice;
        const replacements = [
            [/\b[Tt]he user\b/g, "you"],
            [/\bthey are\b/g, "you are"],
            [/\bthey were\b/g, "you were"],
            [/\bthey have\b/g, "you have"],
            [/\bthey\b/g, "you"],
            [/\bthem\b/g, "you"],
            [/\btheir\b/g, "your"],
            [/\bthemselves\b/g, "yourself"],
            [/\byou needs\b/g, "you need"],
            [/\byou has\b/g, "you have"]
        ];
        replacements.forEach(([pattern, replacement]) => {
            reason = reason.replace(pattern, replacement);
        });
        reason = reason.charAt(0).toLowerCase() + reason.slice(1);
        return `I selected option '${choice}' because ${reason}`;
    }

    async callGramanerHandler(transcript) {
        const response = await fetch('/api/gramanerExtract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entities: ['name', 'address', 'relationship', 'phone_number'], input: transcript }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data.name == null || data.relationship == null || data.address == 'null' || data.phone_number == 'null') return null;
        return data;
    }

    async classifyAdl(transcript, currentStepIndex) {
        const adlIndex = steps.slice(0, currentStepIndex + 1).filter(s => s.type === 'adl').length - 1;
        const adlQuestion = window.adl_questions?.[adlIndex];
        if (!adlQuestion) return null;
        const payload = { question: adlQuestion.question, user_input: transcript, choices: adlQuestion.choices };

        try {
            const response = await fetch('https://voicewebapp.straivedemo.com/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data;
        } catch {
            return null;
        }
    }
}
