# cod-zombies

Milestone 1 implements a dependency-free, headless game-logic layer for a
player moving through a sandbox while a zombie pursues it.

## Run

Requires Node.js 18 or newer.

```sh
npm start
```

The demo simulates player input and logs both entities' state each frame. No
rendering or canvas code is included.

## Test

```sh
npm test
```

## Controls API

Call `sandbox.step(input, deltaTime)` once per frame. `deltaTime` is measured in
seconds, and `input` can contain the boolean properties `up`, `down`, `left`,
and `right`.
