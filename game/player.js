"use strict";

const { normalize } = require("./vector");

class Player {
  constructor({ position = { x: 0, y: 0 }, speed = 200, size = 10 } = {}) {
    this.position = { x: position.x, y: position.y };
    this.speed = speed;
    this.size = size;
  }

  update(input = {}, deltaTime) {
    validateDeltaTime(deltaTime);

    const horizontal = axisValue(input.right) - axisValue(input.left);
    const vertical = axisValue(input.down) - axisValue(input.up);
    const direction = normalize({ x: horizontal, y: vertical });

    this.position.x += direction.x * this.speed * deltaTime;
    this.position.y += direction.y * this.speed * deltaTime;
  }
}

function axisValue(value) {
  return value ? 1 : 0;
}

function validateDeltaTime(deltaTime) {
  if (!Number.isFinite(deltaTime) || deltaTime < 0) {
    throw new TypeError("deltaTime must be a non-negative finite number");
  }
}

module.exports = { Player };
