import { BaseView } from './base-view.js';

export class GettingStartedView extends BaseView {
    constructor(id)
    {
        super(id);

        this.labels = {
            en: { title: "Getting Started", guide: "Services required for patient onboarding into our Hospital", orientation: "Patient Orientation", assessment: "Patient Assessment" },
            zh: {
                title: "入门指南",
                guide: "入职所需服务",
                orientation: "入院导览",
                assessment: "注册"
              }
        };

        this.buttons = {
            orientation : this.element.querySelector('#orientation-button'),
            assessment : this.element.querySelector('#assessment-button')
        }

        this.title = this.element.querySelector('#setup-title');
        this.guide = this.element.querySelector('.orientation-guide');
    }

    setLanguage(lang) {
        this.buttons.orientation.querySelector('.button-text').textContent = this.labels[lang].orientation;
        this.buttons.assessment.querySelector('.button-text').textContent = this.labels[lang].assessment;

        this.title.textContent = this.labels[lang].title;
        this.guide.textContent = this.labels[lang].guide;
    }

    bindButtonClick(callback) {
        Object.entries(this.buttons).forEach(([key, button]) => {
            button.addEventListener('click', () => 
                {
                    callback(key);
                });
    });
  }
}