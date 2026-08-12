# cod-zombies

Milestone 2 adds a dependency-free browser rendering layer to the headless
game logic. Move the player while the zombie pursues it; the zombie changes
appearance when it makes contact.

## Run

Requires Node.js 18 or newer.

```sh
npm start
```

The headless demo simulates player input and logs both entities' state each
frame.

## Run in a browser

Open `web/index.html` in a browser. No build step or local server is required.

Use WASD or the arrow keys to move the player.

## Test

```sh
npm test
```

## Controls API

Call `sandbox.step(input, deltaTime)` once per frame. `deltaTime` is measured in
seconds, and `input` can contain the boolean properties `up`, `down`, `left`,
and `right`.
