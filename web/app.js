"use strict";

(function startGame(globalObject) {
  const { Player, Zombie, Sandbox, Renderer, createInput } = globalObject.CODZ;
  const canvas = document.getElementById("game");
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
  const sandbox = new Sandbox({
    width: canvas.width,
    height: canvas.height,
    player,
    zombie,
  });
  const input = createInput();
  const renderer = new Renderer(canvas);
  let lastTimestamp;

  renderer.render(sandbox.snapshot());

  function frame(timestamp) {
    if (lastTimestamp === undefined) {
      lastTimestamp = timestamp;
      globalObject.requestAnimationFrame(frame);
      return;
    }

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    renderer.render(sandbox.step(input, deltaTime));
    globalObject.requestAnimationFrame(frame);
  }

  globalObject.requestAnimationFrame(frame);
}(window));
