import Helper from "./helper.js";
import Platform from "./platform";
import Player from "./player";
import View from "./view";

export default class Game extends View {
  constructor(selector) {
    super();

    this.view = document.querySelector(selector);

    this.gravity = 0.6;
    this.platforms = [];
    this.currentScore = 0;
    this.highScore = 0;
    this.start = false;

    // create play view
    this.playButton = new View();
    this.playButton.setView(`<i id="play" class="fa-solid fa-play"></i>`);
    this.playButton.getView().addEventListener("click", () => {
      if (this.highScore) {
        this.reset();
      }
      this.start = true;
      this.player.jump();
    });
    this.getView().appendChild(this.playButton.getView());

    // create score view
    this.score = new View();
    this.score.setView(
      `<div id="score">HI <span id="high-score">000000</span> <span id="current-score">000000</span></div>`
    );
    this.getView().appendChild(this.score.getView());

    // add controls
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyW":
        case "Space":
        case "ArrowUp":
          if (!this.start) {
            this.reset();
            this.start = true;
          }
          this.player.jump();
          break;
      }
    });
    this.getView().addEventListener("click", () => this.player.jump());

    // setup player and platforms
    this.setup();
  }

  updateScore() {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
    }
    this.score.getView().querySelector("#high-score").innerHTML = this.highScore
      .toString()
      .padStart(6, "0");
    this.score.getView().querySelector("#current-score").innerHTML =
      this.currentScore.toString().padStart(6, "0");
  }

  setPlayer(player) {
    this.player = player;
    this.getView().appendChild(this.player.getView());
  }

  createPlatform() {
    const platform = new Platform();
    const width =
      Helper.getMax(this.getWidth() / 3, 300) + Helper.getRandom(50);
    const height =
      this.getHeight() / 3 - this.player.getHeight() + Helper.getRandom(75);
    platform.setWidth(width);
    platform.setHeight(height);
    return platform;
  }

  addPlatform(platform) {
    this.platforms.push(platform);
    this.getView().appendChild(platform.getView());
  }

  setup() {
    const player = new Player();
    this.setPlayer(player);

    for (let i = 0; i < 3; i++) {
      const platform = this.createPlatform();

      let left = 0;
      if (i) {
        const previousPlatform = this.platforms[i - 1];
        left =
          previousPlatform.getLeft() +
          previousPlatform.getWidth() +
          Helper.getRandom(180, 100);
      } else {
        const height = this.getHeight() / 3 - this.player.getHeight() + 75;
        platform.setHeight(height);
      }
      platform.setLeft(left);
      this.addPlatform(platform);
    }
  }

  reset() {
    this.player.destroy();
    this.platforms.forEach((platform) => platform.destroy());
    this.platforms = [];
    this.start = false;
    this.currentScore = 0;
    this.updateScore();
    this.setup();
  }

  checkPlatformCollision() {
    this.platforms.forEach((platform, i) => {
      // check collision
      if (
        this.player.getLeft() + this.player.getWidth() > platform.getLeft() &&
        this.player.getLeft() < platform.getLeft() + platform.getWidth()
      ) {
        if (
          this.player.getTop() + this.player.getHeight() - 10 >
          platform.getTop()
        ) {
          this.player.setLeft(platform.getLeft() - this.player.getWidth());
          this.player.running = false;
          this.player.getView().classList.add("die");
          this.getView().classList.remove("falling");
          this.player.getView().classList.remove("falling");
        } else if (
          this.player.getTop() + this.player.yVel + this.player.getHeight() >
          platform.getTop()
        ) {
          this.player.jumping = false;
          this.player.yVel = 0;
          this.player.setTop(platform.getTop() - this.player.getHeight());
          this.player.getView().classList.remove("jumping");
        }

        this.player.landed = true;
      }

      if (this.player.running) {
        if (platform.getLeft() + platform.getWidth() < 0) {
          this.platforms.splice(i, 1);
          platform.destroy();

          const previousPlatform = this.platforms[this.platforms.length - 1];
          const left = Helper.getMax(
            previousPlatform.getLeft() + previousPlatform.getWidth(),
            this.getWidth()
          );
          const newPlatform = this.createPlatform();
          newPlatform.setLeft(left + Helper.getRandom(180, 100));
          this.addPlatform(newPlatform);
        } else {
          platform.setLeft(platform.getLeft() - this.player.xVel);
        }
      }
    });
  }

  checkPlayerLanded() {
    if (!this.player.landed) {
      this.player.jumping = true;
    }
  }

  checkPlayerJumping() {
    if (this.player.jumping) {
      this.player.yVel += this.gravity;

      if (this.player.yVel > 0 && this.player.running) {
        this.getView().classList.add("falling");
        this.player.getView().classList.add("falling");
      }
    } else {
      this.player.getView().classList.remove("falling");
      this.getView().classList.remove("falling");
    }
  }

  checkPlayerRunning() {
    if (this.player.running) {
      this.currentScore++;
      this.updateScore();
    }
  }

  checkGameOver() {
    if (this.player.getTop() + this.player.yVel >= this.getHeight()) {
      this.start = false;
    }
  }

  run() {
    setInterval(() => {
      if (this.start) {
        this.playButton.getView().style.display = "none";
        this.player.landed = false;

        this.checkPlatformCollision();

        this.checkPlayerLanded();

        this.checkPlayerJumping();

        this.checkPlayerRunning();

        this.checkGameOver();

        // increase the player speed
        if (this.currentScore % 100 === 0) {
          if (this.player.xVel < 15) {
            this.player.xVel += 0.5;
          }
        }

        // set player jump velocity
        this.player.setTop(this.player.getTop() + this.player.yVel);
      } else {
        this.playButton.getView().style.display = "flex";
      }

      // firefox still doesn't support :has
      if (this.player.getView().classList.contains("jumping")) {
        this.getView().classList.add("jumping");
      } else {
        this.getView().classList.remove("jumping");
      }
      if (this.player.getView().classList.contains("falling")) {
        this.getView().classList.add("falling");
      } else {
        this.getView().classList.remove("falling");
      }
    }, 30);
  }
}
