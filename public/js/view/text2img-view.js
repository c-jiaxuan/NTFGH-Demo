import { BaseView } from "./base-view.js";
import { chatbot_config } from "../config/chatbot-config.js";

export class Text2ImgView extends BaseView {
	constructor(id) {
		super(id);

		this.formContainer = this.element.querySelector("#form-container");
		this.form = this.element.querySelector("#image-prompt-form");
		this.resultContainer = this.element.querySelector("#result-container");
		this.header = this.element.querySelector("#setup-title");

		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			const data = Object.fromEntries(new FormData(this.form).entries());
			this.emit("submit", data);
		});
	}

	showLoading() {
		this.form.style.display = "none";
		this.resultContainer.style.display = "flex";
		this.resultContainer.innerHTML = `
		<div class="media-container">
			<img src="./img/icon/loading.png" alt="Loading..." class="loading-image" />
		</div>
		`;
		this.header.innerHTML = 'Please wait while I generate the image.'
	}

	showResult(url) {
		this.resultContainer.innerHTML = `
			<div class="media-container">
				<img src="${url}" alt="Generated Image" class="generated-image" />
				<div class="button-container">
					<a href="${url}" download="generated-image.png" id="download-button" class="action-button">
						<div class="button-bg"></div>
						<div class="overlay-progress"></div>
						<img class="button-icon" src="./img/icon/down-arrow.png"/>
						<div class="button-text">Download</div>
					</a>
				</div>
			</div>
		`;
		this.header.innerHTML = 'Image generated successfully!';

		// Force download when user clicks
		const downloadBtn = this.resultContainer.querySelector("#download-button");
		downloadBtn.addEventListener("click", async (event) => {
			event.preventDefault();
			const blob = await fetch(url).then(res => res.blob());
			const a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.download = "generated-image.png";  // you can make this dynamic
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(a.href);
		});
	}

	showError(err) {
		this.header.innerHTML = 'My apologies, I could not generate the image.'
		this.resultContainer.innerHTML = `<p>Error: ${err.message}</p>`;
	}

	reset() {
		this.resultContainer.style.display = "none";
		this.formContainer.style.display = "block";
		this.resultContainer.innerHTML = "";
		this.form.reset();
	}
}
