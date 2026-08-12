"use strict";

(function initializeRenderer(globalObject) {
  class Renderer {
    constructor(canvas) {
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("A 2D canvas context is required");
      }

      this.canvas = canvas;
      this.context = context;
    }

    render(snapshot) {
      const { context, canvas } = this;
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.drawBoundary();
      this.drawPlayer(snapshot.player);
      this.drawZombie(snapshot.zombie);
    }

    drawBoundary() {
      const { context, canvas } = this;
      context.strokeStyle = "#506258";
      context.lineWidth = 2;
      context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    }

    drawPlayer(player) {
      const halfSize = player.size / 2;
      this.context.fillStyle = "#73d7ff";
      this.context.fillRect(
        player.position.x - halfSize,
        player.position.y - halfSize,
        player.size,
        player.size,
      );
    }

    drawZombie(zombie) {
      const { fill, stroke } = getZombieStyle(zombie.state);
      const { context } = this;
      const halfSize = zombie.size / 2;

      context.beginPath();
      context.moveTo(zombie.position.x, zombie.position.y - halfSize);
      context.lineTo(zombie.position.x + halfSize, zombie.position.y);
      context.lineTo(zombie.position.x, zombie.position.y + halfSize);
      context.lineTo(zombie.position.x - halfSize, zombie.position.y);
      context.closePath();
      context.fillStyle = fill;
      context.fill();

      if (stroke) {
        context.strokeStyle = stroke;
        context.lineWidth = 2;
        context.stroke();
      }
    }
  }

  function getZombieStyle(state) {
    return state === "contact"
      ? { fill: "#ff4d4d", stroke: "#ffe0a8" }
      : { fill: "#8bd450", stroke: null };
  }

  globalObject.CODZ = globalObject.CODZ || {};
  globalObject.CODZ.Renderer = Renderer;
}(window));
