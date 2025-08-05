import { BaseView } from './base-view.js';

export class GenerationView extends BaseView {
    constructor(id) {
        super(id);

        this.assessmentContainer = this.element.querySelector("#assessment-container");
        this.loadingPageContainer = this.element.querySelector("#loading-page-container");
        this.loadingPageTitle = this.loadingPageContainer.querySelector("#header"); 
        this.resultContainer = this.loadingPageContainer.querySelector("#result-container");

        this.generationPageHeaders = {
            TEXT2IMG:   'Text to Image',
            TEXT2VID:   'Text to Video',
            IMG2VID:    'Image to Video',
            URL2VID:    'URL to Video',
            DOC2VID:    'Document to Videi'
        }
    }

    renderStep(language, step, isLastStep = false) {
        this.assessmentContainer.innerHTML = '';

        const card = document.createElement('div');
        card.className = 'assessment-card';

        // Header
        const header = document.createElement('div');
        header.className = 'general-header';
        if (step.type === 'prompt') {
            const title = document.createElement('strong');
            title.textContent = this.generationPageHeaders.TEXT2IMG;
            header.appendChild(title);
        }
        card.appendChild(header);

        // Question
        const question = document.createElement('h2');
        question.textContent = step.question?.[language] || step.question || '';
        card.appendChild(question);

        if (Array.isArray(step.fields) && step.fields.length > 0) {
            const inputs = [];
            const fieldLayout = document.createElement('div');
            fieldLayout.className = 'field-layout';

            step.fields.forEach(field => {
                const labelText = field[language] || field;

                const fieldContainer = document.createElement('div');
                fieldContainer.className = 'field-group';

                const label = document.createElement('label');
                label.textContent = labelText + ':';

                const textarea = document.createElement('textarea');
                textarea.name = step.input;
                textarea.rows = 3;

                inputs.push(textarea);

                fieldContainer.appendChild(label);
                fieldContainer.appendChild(textarea);
                fieldLayout.appendChild(fieldContainer);
            });

            let isAcknowledged = false;

            const checkAndToggleSubmit = () => {
                const allFilled = inputs.every(input => input.value.trim() !== '');
                const anyFilled = inputs.some(input => input.value.trim() !== '');

                if (anyFilled && !isAcknowledged) {
                    this.emit('readyForAcknowledge', {});
                    isAcknowledged = true;
                } else if (!anyFilled && isAcknowledged) {
                    this.emit('notReadyForAcknowledge', {});
                    isAcknowledged = false;
                }
            };

            inputs.forEach(input => input.addEventListener('input', checkAndToggleSubmit));

            card.appendChild(fieldLayout);
        }

        this.assessmentContainer.appendChild(card);
    }

    resetGenerateFormPage() {
        this.assessmentContainer.innerHTML = '';
        this.loadingPageTitle.innerHTML = '';
        this.resultContainer.innerHTML = '';
        this.resultContainer.style.display = 'none';
    }

	showLoading() {
        // Clear previous screen
        this.assessmentContainer.innerHTML = '';
        this.loadingPageTitle.innerHTML = '';

        // Header
        const title = document.createElement('strong');
        title.textContent = 'Please wait while I generate the image.';
        this.loadingPageTitle.appendChild(title);

		this.resultContainer.style.display = "flex";
		this.resultContainer.innerHTML = `
		<div class="media-container">
			<img src="./img/icon/loading.png" alt="Loading..." class="loading-image" />
		</div>
		`;
	}

    showResult(url) {
        // Clear previous screen
        this.assessmentContainer.innerHTML = '';
        this.loadingPageTitle.innerHTML = '';

        // Header
        const title = document.createElement('strong');
        title.textContent = 'Media generated successfully!';
        this.loadingPageTitle.appendChild(title);

        // Determine if the URL is a video (by extension)
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

        // Render media + download button
        this.resultContainer.innerHTML = `
            <div class="media-container">
            ${
                isVideo
                ? `<video src="${url}" controls class="generated-video"></video>`
                : `<img src="${url}" alt="Generated Image" class="generated-image" />`
            }
            <div class="button-container">
                <a
                href="${url}"
                download="generated.${isVideo ? 'mp4' : 'png'}"
                id="download-button"
                class="action-button"
                >
                <div class="button-bg"></div>
                <div class="overlay-progress"></div>
                <img class="button-icon" src="./img/icon/down-arrow.png" />
                <div class="button-text">Download</div>
                </a>
            </div>
            </div>
        `;

        // Force download when user clicks
        const downloadBtn = this.resultContainer.querySelector('#download-button');
        downloadBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const blob = await fetch(url).then(res => res.blob());
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `generated.${isVideo ? 'mp4' : 'png'}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            } catch (err) {
                console.error('❌ Download failed:', err);
            }
        });
    }


	showError(err) {
        // Clear previous screen
        this.assessmentContainer.innerHTML = '';
        this.loadingPageContainer.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'general-header';
        const title = document.createElement('strong');
        title.textContent = 'My apologies, I could not generate the image.';
        header.appendChild(title);
        this.loadingPageContainer.append(header);

		this.resultContainer.innerHTML = `<p>Error: ${err.message}</p>`;
	}
}
