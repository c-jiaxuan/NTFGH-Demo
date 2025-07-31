import { BaseView } from "./base-view.js";

export class Text2VidView extends BaseView {
  constructor(id) {
    super(id);
    this.form = this.element.querySelector("#video-prompt-form");
    this.output = document.createElement("div");
    this.form.appendChild(this.output);

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(this.form).entries());
      this.emit("submit", data);
      this.showLoading();
    });
  }

  showLoading() {
    this.output.innerHTML = `<img src="./img/generating.png" alt="Loading..." />`;
  }

  showResult(url) {
    this.output.innerHTML = `
      <video src="${url}" alt="Generated Video" />
      <a href="${url}" download class="button">Download</a>
    `;
  }
}
