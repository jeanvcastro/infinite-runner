import View from "./view";
import Player from "./player";
import Platform from "./platform";

export default class Game extends View {
  constructor(selector) {
    super();

    this.view = document.querySelector(selector);

    this.gravity = 0.6;
    this.platforms = [];
    this.currentScore = 0;
    this.highScore = 0;

    // create score view
    this.score = new View();
    this.score.createView(
      `<div id="score">HI <span id="high-score">000000</span> <span id="current-score">000000</span></div>`
    );
    this.view.appendChild(this.score.view);

    // add controls
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyW":
        case "Space":
        case "ArrowUp":
          this.player.jump();
          break;
      }
    });
    this.view.addEventListener("click", () => this.player.jump());

    // setup player and platforms
    this.setup();
  }

  getMax(firstNumber, secondNumber) {
    return Math.max(firstNumber, secondNumber);
  }

  getRandom(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  updateScore() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
    this.score.view.querySelector("#high-score").innerHTML = this.highScore.toString().padStart(6, "0");
    this.score.view.querySelector("#current-score").innerHTML = this.currentScore.toString().padStart(6, "0");
  }

  setPlayer(player) {
    this.player = player;
    this.view.appendChild(this.player.view);
  }

  createPlatform() {
    const colors = ["#2ca8c2", "#98cb4a", "#f76d3c", "#f15f74", "#5481e6"];
    const platform = new Platform();
    const width = this.getMax(this.getWidth() / 3, 300) + this.getRandom(50);
    const height = this.getHeight() / 3 - this.player.getHeight() + this.getRandom(75);
    platform.setWidth(width);
    platform.setHeight(height);
    platform.setColor(colors[this.getRandom(colors.length - 1)]);
    return platform;
  }

  addPlatform(platform) {
    this.platforms.push(platform);
    this.view.appendChild(platform.view);
  }

  setup() {
    const player = new Player();
    this.setPlayer(player);

    for (let i = 0; i < 3; i++) {
      let left = 0;
      if (i) {
        const previousPlatform = this.platforms[i - 1];
        left = previousPlatform.getLeft() + previousPlatform.getWidth() + this.getRandom(200, 100);
      }
      const platform = this.createPlatform();
      platform.setLeft(left);
      this.addPlatform(platform);
    }
  }

  reset() {
    this.currentScore = 0;
    this.player.destroy();
    this.platforms.forEach((platform) => platform.destroy());
    this.platforms = [];
    this.setup();
  }

  run() {
    setInterval(() => {
      this.player.landed = false;

      this.platforms.forEach((platform, i) => {
        if (
          this.player.getLeft() + this.player.getWidth() > platform.getLeft() &&
          this.player.getLeft() < platform.getLeft() + platform.getWidth()
        ) {
          if (this.player.getTop() > platform.getTop()) {
            this.player.setLeft(platform.getLeft() - this.player.getWidth());
            this.player.running = false;
          } else if (this.player.getTop() + this.player.yVel + this.player.getHeight() > platform.getTop()) {
            this.player.jumping = false;
            this.player.yVel = 0;
            this.player.setTop(platform.getTop() - this.player.getHeight());
          }

          this.player.landed = true;
        }

        if (this.player.running) {
          if (platform.getLeft() + platform.getWidth() < 0) {
            this.platforms.splice(i, 1);
            platform.destroy();

            const previousPlatform = this.platforms[this.platforms.length - 1];
            const left = this.getMax(previousPlatform.getLeft() + previousPlatform.getWidth(), this.getWidth());
            const newPlatform = this.createPlatform();
            newPlatform.setLeft(left + this.getRandom(200, 100));
            this.addPlatform(newPlatform);
          } else {
            platform.setLeft(platform.getLeft() - this.player.xVel);
          }
        }
      });

      if (!this.player.landed) {
        this.player.jumping = true;
      }

      if (this.player.getTop() + this.player.yVel >= this.getHeight()) {
        //alert("Ah não cara! Você morreu!");
        this.reset();
      }

      if (this.player.jumping) {
        this.player.yVel += this.gravity;
      }

      this.player.setTop(this.player.getTop() + this.player.yVel);

      this.currentScore++;
      this.updateScore();

      if (this.currentScore % 100 === 0) {
        this.player.xVel += 0.5;
      }
    }, 30);
  }
}
