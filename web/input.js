"use strict";

(function initializeInput(globalObject) {
  const directionByCode = {
    KeyW: "up",
    ArrowUp: "up",
    KeyS: "down",
    ArrowDown: "down",
    KeyA: "left",
    ArrowLeft: "left",
    KeyD: "right",
    ArrowRight: "right",
  };

  function createInput() {
    const state = { up: false, down: false, left: false, right: false };

    function updateDirection(event, isPressed) {
      const direction = directionByCode[event.code];

      if (!direction) {
        return;
      }

      state[direction] = isPressed;

      if (event.code.startsWith("Arrow")) {
        event.preventDefault();
      }
    }

    globalObject.addEventListener("keydown", (event) => updateDirection(event, true));
    globalObject.addEventListener("keyup", (event) => updateDirection(event, false));
    globalObject.addEventListener("blur", () => {
      Object.keys(state).forEach((direction) => {
        state[direction] = false;
      });
    });

    return state;
  }

  globalObject.CODZ = globalObject.CODZ || {};
  globalObject.CODZ.createInput = createInput;
}(window));
