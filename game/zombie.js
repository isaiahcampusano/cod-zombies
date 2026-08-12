"use strict";

const { normalize, subtract } = require("./vector");

class Zombie {
  constructor({ player, position = { x: 0, y: 0 }, speed = 100, size = 10 } = {}) {
    if (!player || !player.position) {
      throw new TypeError("Zombie requires a Player instance");
    }

    this.player = player;
    this.position = { x: position.x, y: position.y };
    this.speed = speed;
    this.size = size;
    this.state = "chasing";
  }

  update(deltaTime) {
    validateDeltaTime(deltaTime);

    if (this.state === "contact") {
      return;
    }

    const toPlayer = subtract(this.player.position, this.position);
    const direction = normalize(toPlayer);

    this.position.x += direction.x * this.speed * deltaTime;
    this.position.y += direction.y * this.speed * deltaTime;
  }
}

function validateDeltaTime(deltaTime) {
  if (!Number.isFinite(deltaTime) || deltaTime < 0) {
    throw new TypeError("deltaTime must be a non-negative finite number");
  }
}

module.exports = { Zombie };
