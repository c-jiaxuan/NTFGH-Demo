import { BaseView } from './base-view.js';

export class PatientAssessmentView extends BaseView {
    constructor(id)
    {
        super(id);
    }

    renderStep(language, step) {
        this.element.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'assessment-card';

        // Header for all step types
        const header = document.createElement('div');
        header.className = 'general-header';
        if (step.type === 'adl') {
            const title = document.createElement('strong');
            title.textContent = language === 'en'
                ? 'Assistance of Daily Living Screening'
                : '日常生活协助评估';
            header.appendChild(title);

            const explanationList = document.createElement('ul');
            explanationList.className = 'adl-explanation';

            const items = language === 'en'
                ? [
                    ['Independent', 'Able to perform tasks without any help or assistive device.'],
                    ['Needs assistance', 'Able to perform tasks, however needs some help or assistive device to complete task.'],
                    ['Dependent', 'Unable to perform the task at all, requires total help to perform task.']
                ]
                : [
                    ['独立', '可以在没有任何帮助或辅助设备的情况下完成任务。'],
                    ['需要协助', '可以完成任务，但需要一些帮助或使用辅助设备。'],
                    ['完全依赖', '完全无法独立完成任务，需要全面协助。']
                ];

            items.forEach(([label, text]) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${label}:</strong> ${text}`;
                explanationList.appendChild(li);
            });

            header.appendChild(document.createElement('br'));
            header.appendChild(explanationList);
        } else if (step.type === 'assessment') {
            header.innerHTML = `
                <strong>${language === 'en' ? 'Please answer the following question to help us understand your profile better.' : '请回答以下问题，以帮助我们更好地了解您的个人情况。'}</strong>
            `;
        } else if (step.type === 'next-of-kin') {
            header.innerHTML = `
                <strong>${language === 'en' ? 'Please add and fill in details of any Next-Of-Kin (NOK)' : '请添加并填写紧急联系人的相关资料'}</strong>
            `;
        }
        card.appendChild(header);

        const question = document.createElement('h2');
        question.textContent = step.question?.[language] || step.question || '';
        card.appendChild(question);

        if (Array.isArray(step.options) && step.options.length > 0) {
            step.options.forEach(opt => {
                const label = typeof opt === 'object' ? opt[language] : opt;
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = label;
                button.onclick = () => {
                  Array.from(card.querySelectorAll('.option-button')).forEach(b => b.classList.remove('selected'));
                  button.classList.add('selected');
                  this.emit("readyForAcknowledge", {});
                };
                card.appendChild(button);
              });
        } else if (Array.isArray(step.fields) && step.fields.length > 0) {
            const inputs = [];

            const fieldLayout = document.createElement('div');
            fieldLayout.className = 'field-layout';

            step.fields.forEach(field => {
                const labelText = typeof field === 'object' ? field[language] : field;
                const fieldContainer = document.createElement('div');
                fieldContainer.className = 'field-group';
                const label = document.createElement('label');
                label.textContent = labelText + ':';
                const input = document.createElement('input');
                input.type = 'text';
                input.name = labelText;

                inputs.push(input);
                
                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
                fieldLayout.appendChild(fieldContainer);
            });

            const checkAndProceed = () => {
                const allFilled = inputs.every(input => input.value.trim() !== '');
                if (allFilled) {
                    this.emit("readyForAcknowledge", {});
                }
            };

            inputs.forEach(input => {
                input.addEventListener('keyup', checkAndProceed);
              });

            card.appendChild(fieldLayout);
        }

        this.element.appendChild(card);
    }
}
