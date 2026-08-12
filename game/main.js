"use strict";

const { Player } = require("./player");
const { Zombie } = require("./zombie");
const { Sandbox } = require("./sandbox");

function createGame() {
  const player = new Player({
    position: { x: 400, y: 300 },
    speed: 200,
    size: 12,
  });
  const zombie = new Zombie({
    player,
    position: { x: 100, y: 100 },
    speed: 100,
    size: 14,
  });

  return new Sandbox({ width: 800, height: 600, player, zombie });
}

function runHeadlessDemo() {
  const game = createGame();
  const deltaTime = 1 / 10;

  for (let frame = 0; frame < 60; frame += 1) {
    const input = frame < 10 ? { right: true } : {};
    const state = game.step(input, deltaTime);
    console.log(`frame ${frame + 1}`, JSON.stringify(state));
  }
}

if (require.main === module) {
  runHeadlessDemo();
}

module.exports = { createGame, runHeadlessDemo };
