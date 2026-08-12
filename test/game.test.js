"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { Player } = require("../game/player");
const { Zombie } = require("../game/zombie");
const { Sandbox } = require("../game/sandbox");

function createSandbox({
  playerPosition = { x: 0, y: 0 },
  playerSpeed = 10,
  playerSize = 1,
  zombiePosition = { x: 10, y: 0 },
  zombieSpeed = 2,
  zombieSize = 1,
  onContact = () => {},
} = {}) {
  const player = new Player({ position: playerPosition, speed: playerSpeed, size: playerSize });
  const zombie = new Zombie({ player, position: zombiePosition, speed: zombieSpeed, size: zombieSize });
  return new Sandbox({ player, zombie, onContact });
}

test("player movement is normalized and frame-rate independent", () => {
  const player = new Player({ speed: 10 });

  player.update({ right: true, down: true }, 0.5);

  assert.ok(Math.abs(player.position.x - 5 / Math.sqrt(2)) < 1e-10);
  assert.ok(Math.abs(player.position.y - 5 / Math.sqrt(2)) < 1e-10);
});

test("zombie seeks the player's updated position", () => {
  const game = createSandbox();

  game.step({ right: true }, 0.5);

  assert.deepEqual(game.player.position, { x: 5, y: 0 });
  assert.deepEqual(game.zombie.position, { x: 9, y: 0 });
  assert.equal(game.zombie.state, "chasing");
});

test("contact is reported once per transition and resets after separation", () => {
  let contacts = 0;
  const game = createSandbox({
    playerPosition: { x: 0, y: 0 },
    playerSpeed: 10,
    zombiePosition: { x: 1, y: 0 },
    zombieSpeed: 0,
    onContact: () => { contacts += 1; },
  });

  game.step({}, 0);
  game.step({}, 0);
  assert.equal(game.zombie.state, "contact");
  assert.equal(contacts, 1);

  game.step({ left: true }, 1);
  assert.equal(game.zombie.state, "chasing");

  game.step({ right: true }, 1);
  assert.equal(game.zombie.state, "contact");
  assert.equal(contacts, 2);
});

test("sandbox validates that zombie references its player", () => {
  const player = new Player();
  const otherPlayer = new Player();
  const zombie = new Zombie({ player: otherPlayer });

  assert.throws(() => new Sandbox({ player, zombie }), /must reference/);
});
