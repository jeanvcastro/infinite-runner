import View from "./view";

export default class Player extends View {
  constructor() {
    super();
    const id = "player";
    this.createView(`<div id="${id}"></div>`);

    this.running = true;
    this.jumping = true;
    this.landed = false;
    this.yVel = 0;
    this.xVel = 10;
  }

  jump() {
    if (!this.jumping) {
      this.jumping = true;
      this.yVel -= 10;
    }
  }
}
