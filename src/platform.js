import View from "./view";

export default class Platform extends View {
  constructor() {
    super();
    this.createView(`<div class="platform"></div>`);
  }

  setColor(color) {
    this.view.style.backgroundColor = color;
  }
}
