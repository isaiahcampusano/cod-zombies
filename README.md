# cod-zombies

milestones:
> can one enemy pursue player  (learn: positions, movement, update loop)
> can the player damage the enemy (bullets, collision, health)
> can the enemy spawn repeatedly (learn: spawning systems, timers)
> can multiple enemies chase the player at once (learn: updating multiple objects each frame)
> can the game scale difficulty over rounds (learn: game state and progression) 
> can the player survive the complete loop (tying systems together)
> can a zombie detect when it reaches a player 


paste to codex on tuesday: 
I’ll help you design the minimal architecture for Milestone 1 — **one zombie continuously pursuing a moving player** — without jumping ahead to guns, health, or rounds. Everything here is about the smallest testable system that proves pursuit works.

---

## 1. Objects That Need to Exist for Milestone 1

Your guess is correct: **Game/Sandbox**, **Player**, **Zombie**.  
A “Sandbox” or “Game” object acts as the container that owns the loop, holds references to the other objects, and handles the render/update cycle. You don’t need anything else yet.

Explicitly **not** needed now: weapons, projectiles, health, spawners, rounds, UI, camera‑switching, physics engine, or even a world‑grid. Keep the environment flat and infinite for now — no walls, no obstacles.

---

## 2. Information Each Object Should Own

### Player
- **position** (x, y) – where the player is in the sandbox
- **movement speed** (pixels per second, or units per second)
- **size** (width/height or radius) – for simple visual and later collision checks, even if not used yet

*Why:* The player needs to know where it is so it can move itself and be drawn. Speed and size are innate to the player entity. No reference to the zombie should exist here — the player doesn’t need to know about its pursuer.

### Zombie
- **position** (x, y)
- **movement speed** (slower than the player’s for a clear chase)
- **target reference** (the player object, or the player’s position supplied externally)
- **size** (for visual and eventual “reached” detection)

*Why:* The zombie moves toward a target. Giving it a direct reference to the player allows it to read the player’s position every frame without needing a global variable. Alternatively, the game loop can pass the player’s position to the zombie’s update method (more on that below).

### Sandbox (Game)
- **player instance**
- **zombie instance**
- **game loop** (update & render cycle)
- **rendering surface** (canvas, screen, etc.)
- (possibly) input state – which keys are currently pressed

*Why:* The sandbox owns the lifecycle; it creates the player and zombie, runs the loop, and coordinates updates.

---

## 3. How the Objects Should Communicate

The core question: *How does the zombie get the player’s position?*

Three common approaches, from simplest to more decoupled:

1. **Zombie holds a direct reference to the player object**  
   `this.target = player;`  
   Inside the zombie’s update: `let dx = this.target.x - this.x;`  
   *Trade‑off:* Tight coupling. The zombie knows exactly what a player is. This is fine for a tiny prototype and makes the code extremely readable.

2. **Zombie receives the target position as a parameter in its update function**  
   `zombie.update(playerPosition)`  
   The game loop reads the player’s position and passes it in.  
   *Trade‑off:* Zombie doesn’t need to know the player object exists, only “move toward this point”. Decouples the zombie from the player’s implementation, but the loop must explicitly broker the data. Slightly more indirection.

3. **Event‑driven or messaging** — the player emits position updates, the zombie subscribes. Overkill now.

**Recommendation for Milestone 1:** Use method 1 (direct reference). It’s the smallest amount of code and lets you focus on the movement logic. You can refactor later when more enemies or pathfinding require cleaner separation.

---

## 4. Game Loop Breakdown

A typical real‑time game loop for this sandbox:

```
while game is running:
    process input
    update player
    update zombie
    detect contact (zombie reached player?)
    render everything
    wait until next frame (delta time)
```

Let’s look at why each step exists:

### 4.1 Process Input
Read keyboard or mouse state (e.g., WASD / arrow keys).  
*Why:* We need to turn human intention into player movement. This step is separate so that the player’s update can use the collected input direction cleanly.

### 4.2 Update Player
Based on the current input, calculate a new position for the player. This involves:
- Input direction vector (normalized)
- Multiply by speed and delta time (so movement is frame‑rate independent)
- Add to current position

*Why delta time?* Without it, the player would move at “X pixels per frame”. On a 144 Hz monitor the player would move much faster than on 30 Hz. Delta time (the fraction of a second since the last frame) keeps the movement speed consistent regardless of frame rate. This is critical for a game to feel fair and predictable.

### 4.3 Update Zombie
Zombie calculates a direction vector from its own position toward the player’s current position.  
- Subtract positions: `dirX = player.x - zombie.x`, `dirY = player.y - zombie.y`
- Compute distance (optional, but useful for contact detection).  
- Normalize the direction vector (so it has length 1) and multiply by zombie speed and delta time to get a movement step.  
- Update zombie position.

*Why normalize?* If you just add the raw difference, the zombie would move faster when it’s far away and slower when it’s close. Normalizing makes the movement speed constant, independent of distance.

*Vector concepts:* A position can be thought of as a point (x, y). A direction is a vector: the difference between two points. Normalization divides each component by the length, giving a vector of length 1 that points in the same direction.

### 4.4 Detect Contact
After both positions are updated, check if the zombie has “reached” the player. Simplest method: check if the distance between their positions is less than some threshold (sum of their half‑sizes or a fixed reach distance).  
*Why after updates?* Positions have just changed this frame — you want to catch the moment of contact immediately, not a frame late.

### 4.5 Render
Clear the drawing area, draw the player (square), draw the zombie (diamond) at their current positions.  
*Why separate from update?* Keeps the logic (update) and presentation (render) decoupled. It’s easier to change how things look without touching movement code.

### 4.6 Frame Timing
At the end of the loop, you either use `requestAnimationFrame` (browser) or a timer to call the loop again. Delta time is often passed to the update function automatically.

---

## 5. What Happens When the Zombie Reaches the Player?

Before any health system, the goal is to prove contact detection works.  
**Recommendation:** When the distance between the two center points is less than, say, the sum of their half‑widths, **the zombie stops moving and changes color** (e.g., turns red).

Why this is a good test:
- Visually unambiguous — you see the diamond turn red the exact moment it touches the square.
- It confirms that the distance check is correct.
- It doesn’t require any extra state like health counters.
- It’s easy to revert later (you’ll replace the color change with an attack or damage).

Alternative: Print a console message (“Zombie reached player!”) every frame contact persists. The color change is better because it’s immediate visual feedback, but a console log works if you’re in a text‑only prototype.

If you want to keep the zombie moving after contact (it’s a “touch” not a “grab”), you could make it bounce back or circle, but the simplest test is to lock it in place. That shows “I detected that we are close enough.”

---

## 6. Implementation Sequence for Milestone 1

Each step produces something observable. I’ve ordered them so that you can run and see progress immediately.

### Step 1 – Create an empty sandbox window
**What:** A window/canvas with a solid background (e.g., 800×600). A simple game loop that just clears and redraws the background at 60 FPS.  
**Why:** Establish the render loop and verify that your environment (browser canvas, Python with pygame, etc.) works.  
**Success condition:** You see a static colored rectangle (the window) that refreshes smoothly. Nothing else.

### Step 2 – Add a player square that moves with keyboard input
**What:** Draw a filled square (say, 40×40 px) at the center of the sandbox. Read arrow keys or WASD. On each frame, update the square’s position based on held keys. Use delta time.  
**Why:** Adds player movement, the core input and update logic. This confirms you can translate user intent into position changes.  
**Success condition:** Square slides around smoothly in all four directions, stops when keys released. Speed is consistent regardless of frame rate.

### Step 3 – Add a zombie diamond that sits still
**What:** Draw a diamond shape (a rotated square) somewhere away from the player (e.g., top‑left corner). It doesn’t move yet.  
**Why:** Introduces the second game object and ensures rendering works for two separate entities.  
**Success condition:** You see a square and a diamond on screen. Moving the player does not affect the diamond.

### Step 4 – Make the zombie move toward a static target point (not the player yet)
**What:** Instead of chasing the player, code the zombie to move toward a hard‑coded point (e.g., center of the screen). Implement direction vector calculation, normalization, speed × delta time.  
**Why:** Isolates the zombie’s movement logic from the player. You can test that movement math works without worrying about a moving target.  
**Success condition:** The diamond slides in a straight line to the chosen point and stops exactly on it (distance < 1 pixel). Color change when it arrives (or console log) to prove detection.

### Step 5 – Connect the zombie to the player
**What:** Replace the static target point with the player’s current position. Every frame the zombie recalculates direction toward the player.  
**Why:** This is the actual pursuit. By now, you’ve confirmed that input, player motion, zombie motion, and contact detection all work in isolation.  
**Success condition:** The diamond continuously tracks the moving square, always moving directly toward it. If you stand still, the zombie reaches you, stops (or turns red). If you move, it follows relentlessly.

### Step 6 – (Optional polish) Tune speeds and sizes
Adjust player speed slightly higher than zombie speed so it’s a chase, not an instant catch. Make sure the “reached” threshold feels right visually.

After Step 5, Milestone 1 is functionally complete. You have answered: *Can one game object continuously pursue another moving game object?*  
You’ve also built the core loop that will host every future system.

---

## 7. Clear Success Criteria for Milestone 1

- **Pursuit:** The zombie diamond always moves along a direct line toward the player’s current position.
- **Responsiveness:** If the player changes direction, the zombie’s movement vector updates immediately to follow.
- **Contact detection:** When the zombie gets close enough (visibly overlapping the player square), the zombie stops and changes color (or logs a message). It does not continue to drift inside the player.
- **Frame‑rate independence:** The chase speed doesn’t change noticeably if the frame rate varies (test by throttling or running on different machines).
- **No crashes or jitter** from unnormalized vectors or division by zero when the zombie is exactly on top of the player.

---

## 8. Questions to Intentionally Leave Unanswered (for later milestones)

- How does a zombie attack or deal damage?
- What is the player’s health, and what happens when it reaches zero?
- Can the zombie die?
- Should there be multiple zombies?
- How are zombies spawned?
- Is the game first‑person or top‑down? (For this sandbox, a 2D top‑down view is ideal; first‑person can be added later by changing the camera and player representation, but the pursuit logic remains identical.)
- Pathfinding around obstacles (we have no obstacles yet).
- Bullet / weapon logic.
- Round system.
- Any UI or menus.

The architecture you build here — a loop with update/render, entities with position and movement, vector math, and delta time — will directly carry forward into every later feature. When you’re ready for Milestone 2 (damage), you’ll simply add a `health` property to the zombie and let bullets reduce it, reusing the same contact detection concepts.

---

## Summary Diagram (Mental Model)

```
+----------------------------+
|        Game Loop           |
|                            |
| 1. Input → direction       |
| 2. Player.update(dt, dir)  |
| 3. Zombie.update(dt)       |    Zombie reads player.x, player.y
| 4. Check distance          |
|    if close → zombie stop/ |
|    color change            |
| 5. Render Player, Zombie   |
+----------------------------+
```

- **Player** owns: position, speed, size.
- **Zombie** owns: position, speed, size, reference to player (or receives target position).
- **Sandbox** owns: both objects, loop, rendering surface.

This is the smallest possible working system that answers your pursuit question. After you have it running, you can begin the next question: *Can the player damage the enemy?* with confidence that the core update loop is solid.
