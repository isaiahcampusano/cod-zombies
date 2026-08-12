"use strict";

(function initializeVector(globalObject) {
function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

function length(vector) {
  return Math.hypot(vector.x, vector.y);
}

function normalize(vector) {
  const magnitude = length(vector);

  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
}

const vectorApi = { subtract, length, normalize };

if (typeof module !== "undefined" && module.exports) {
  module.exports = vectorApi;
} else {
  globalObject.CODZ = globalObject.CODZ || {};
  globalObject.CODZ.Vector = vectorApi;
}
}(typeof window !== "undefined" ? window : globalThis));
