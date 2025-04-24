import { BaseView } from './base-view.js';

export class OrientationView extends BaseView {
    constructor(id)
    {
        super(id);

        this.stepTitle = document.getElementById('step-title');
        this.contentBlock = document.getElementById('content-block');
        this.guideBlock = this.element.querySelector('.orientation-guide');
    }

    renderStep(majorStep, minorStep, major, minor)
    {
        this.clearAllIntervals();
        
        const displayTitle = majorStep.localizedTitle || majorStep.title;
        this.stepTitle.innerHTML = `
          <span id="majorStepTitle">${displayTitle} (${minor + 1}/${majorStep.substeps.length})</span><br>
          <span style="font-size: 24px;" id="subStepTitle">${minorStep.title}</span>`;
        this.contentBlock.innerHTML = '';

        if (this.guideBlock) {
            const lang = minorStep.language || 'en';
            const guideMessages = {
              en: "Please view the following information and acknowledge upon completing them",
              zh: "请查看以下信息，并在完成后点击确认"
            };
          
            this.guideBlock.textContent = guideMessages[lang] || guideMessages.en;
          }

        if (minorStep.type === 'text') {
            const p = document.createElement('p');
            p.innerHTML = minorStep.content;
            p.id = 'textSubstep';  // ID for text type substep
            this.contentBlock.appendChild(p); 
            
            this.emit("readyForAcknowledge", {});
        } 
        else if (minorStep.type === 'image') {
            const img = document.createElement('img');
            img.src = minorStep.src;
            img.id = 'imageSubstep';  // ID for image type substep
            img.style.maxWidth = '100%';
            this.contentBlock.appendChild(img);
            this.emit("readyForAcknowledge", {});
        } 
        else if (minorStep.type === 'text-image') {
            const text = document.createElement('p');
            text.innerHTML = minorStep.content;
            text.id = 'textImageText';  // ID for text part of text-image substep
            const img = document.createElement('img');
            img.src = minorStep.imgSrc;
            img.id = 'textImageImg';  // ID for image part of text-image substep
            img.style.maxWidth = '100%';
            this.contentBlock.appendChild(text);
            this.contentBlock.appendChild(img);
            this.emit("readyForAcknowledge", {});
        } 
        else if (minorStep.type === 'video') {
            const video = document.createElement('video');
            video.src = minorStep.src;
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
            this.contentBlock.appendChild(wrapper);
        
            // Countdown logic before full screen
            let countdown = 3;
            const countdownInterval = setInterval(() => {
            countdown--;
            if (minorStep.countdownMessage) {
                countdownText.textContent = minorStep.countdownMessage(countdown);
            } else {
                countdownText.textContent = "Video is starting in " + countdown; // fallback
            }     

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                    video.requestFullscreen().catch(() => {});
                    video.play();
                    countdownText.style.display = 'none';
                }, 500);
            }
            }, 1000);

            this.intervals.push(countdownInterval);
    
            video.onended = () => {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                this.emit("readyForAcknowledge", {});
            };
        } 
        else if (minorStep.type === 'quiz') {
            const quizContainer = document.createElement('div');
            quizContainer.id = 'quizSubstep';
            
            // Options
            const optionsWrapper = document.createElement('div');
            optionsWrapper.style.display = 'grid';
            optionsWrapper.style.justifySelf = 'center';
            optionsWrapper.style.gap = '10px';
            optionsWrapper.style.marginTop = '20px';
            
            minorStep.content.options.forEach(opt => {
                const btn = document.createElement("button");
                btn.className = "action-button";

                const bg = document.createElement("div");
                bg.className = "button-bg";

                const text = document.createElement("div");
                text.className = "button-text";
                const lang = minorStep.language || 'en'; // default fallback
                const displayText = (lang !== 'en' && opt.translations?.[lang])
                  ? opt.translations[lang]
                  : opt.text;
                
                text.textContent = displayText;

                btn.appendChild(bg);
                btn.appendChild(text);
        
                btn.onclick = () => {
                if (opt.correct) {
                    btn.className = 'action-button correct';
                } else {
                    btn.className = 'action-button wrong';
                }

                this.emit("readyForAcknowledge", {});
        
                optionsWrapper.childNodes.forEach(child => {
                    if(child != btn){
                        child.className = 'action-button-disabled';
                    }
                })
        
                //Trigger response
        
                //skip or no skip
                this.emit("quizAnswered", { detail: opt.nextQns });
                };
                optionsWrapper.appendChild(btn);
            });
            
            quizContainer.appendChild(optionsWrapper);
            this.contentBlock.appendChild(quizContainer);
        }
    }
}
