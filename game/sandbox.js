"use strict";

const { length, subtract } = require("./vector");

class Sandbox {
  constructor({ width = 800, height = 600, player, zombie, onContact } = {}) {
    if (!player || !zombie) {
      throw new TypeError("Sandbox requires a player and a zombie");
    }

    if (zombie.player !== player) {
      throw new TypeError("Zombie must reference the Sandbox player");
    }

    this.width = width;
    this.height = height;
    this.player = player;
    this.zombie = zombie;
    this.entities = [player, zombie];
    this.onContact = onContact || (() => console.log("contact!"));
    this._loopHandle = null;
    this._lastFrameTime = null;
  }

  step(input = {}, deltaTime) {
    this.player.update(input, deltaTime);
    this.zombie.update(deltaTime);
    this.checkContact();

    return this.snapshot();
  }

  checkContact() {
    const distance = length(subtract(this.player.position, this.zombie.position));
    const nextState = distance < this.player.size + this.zombie.size
      ? "contact"
      : "chasing";

    if (nextState === "contact" && this.zombie.state !== "contact") {
      this.onContact({ player: this.player, zombie: this.zombie, distance });
    }

    this.zombie.state = nextState;
    return nextState === "contact";
  }

  snapshot() {
    return {
      player: {
        position: { ...this.player.position },
        speed: this.player.speed,
        size: this.player.size,
      },
      zombie: {
        position: { ...this.zombie.position },
        speed: this.zombie.speed,
        size: this.zombie.size,
        state: this.zombie.state,
      },
    };
  }

  start({ getInput = () => ({}), onFrame = () => {}, framesPerSecond = 60 } = {}) {
    if (this._loopHandle !== null) {
      return;
    }

    if (!Number.isFinite(framesPerSecond) || framesPerSecond <= 0) {
      throw new TypeError("framesPerSecond must be a positive finite number");
    }

    const frameDuration = 1000 / framesPerSecond;
    this._lastFrameTime = Date.now();
    this._loopHandle = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - this._lastFrameTime) / 1000;
      this._lastFrameTime = now;
      onFrame(this.step(getInput(), deltaTime));
    }, frameDuration);
  }

  stop() {
    if (this._loopHandle !== null) {
      clearInterval(this._loopHandle);
      this._loopHandle = null;
      this._lastFrameTime = null;
    }
  }
}

module.exports = { Sandbox };
