"use strict";

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

module.exports = { subtract, length, normalize };
