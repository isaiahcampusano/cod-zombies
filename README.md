# cod-zombies
cod zombies clone (building w first principles)

** can i recreate a systematic breakdown of a game and optimize the path toward the alpha/beta release

# Smallest Buildable Version Exercise

## Purpose

The goal is not to build the entire game at once.

The goal is to identify the smallest interaction that proves the core idea works, build it, understand it, and then add one dependency at a time.

---

## Step 1: Describe the core experience

Complete this sentence:

> The player should be able to __________.

Examples:

* The player should be able to survive while a zombie moves toward them.
* The player should be able to place a unit that moves toward an enemy tower.

Do not include menus, progression systems, cosmetics, multiplayer, maps, or extra features yet.

---

## Step 2: Remove the theme

Replace all recognizable characters, artwork, animations, and environments with basic shapes.

Examples:

* Player = square
* Zombie = second square
* Clash Royale unit = circle
* Tower = rectangle
* Bullet = small dot
* Arena = empty box

The first version should still function even if it looks ugly.

---

## Step 3: List what must exist

Ask:

> What objects must exist for the core interaction to happen?

For each object, write only what it absolutely needs to do.

### Object

**What is it?**

**What information does it need?**

**What action can it perform?**

Example:

### Zombie

**What is it?**
A basic object representing an enemy.

**What information does it need?**
Its position and the player’s position.

**What action can it perform?**
Move a small distance toward the player.

---

## Step 4: Break down every unclear word

Take each action and ask:

> What does that mean mechanically?

Continue until the action can be described as something the computer can calculate or change.

Example:

**The zombie tracks the player.**

What does “tracks” mean?

* Read the player’s position.
* Compare it with the zombie’s position.
* Determine the direction toward the player.
* Move the zombie a small distance in that direction.
* Repeat every frame.

Nothing should remain magical or unexplained.

---

## Step 5: Define the smallest test

Complete this sentence:

> I will know the first version works when __________.

The test should describe one visible result.

Examples:

* I can move around an empty room while one square continuously moves toward me.
* I can place one unit, and it automatically walks toward one tower.
* A moving object can cross a player-built beam without falling.

---

## Step 6: Explicitly exclude features

Write a **Not Yet** list.

This prevents the project from expanding before the core interaction works.

### Not Yet

* Menus
* Character models
* Detailed environments
* Multiplayer
* Progression systems
* Multiple enemy types
* Sound effects
* Cosmetics
* Accounts
* Shops
* Deck building
* Round systems
* Advanced artificial intelligence

These are not rejected ideas. They are postponed dependencies.

---

## Step 7: Build one vertical slice

A vertical slice is one tiny interaction that works from beginning to end.

It does not need to be polished.

It only needs to prove the project’s central behavior.

### Zombies vertical slice

1. Create an empty room.
2. Represent the player with a basic object or camera.
3. Represent one zombie with a basic shape.
4. Store both positions.
5. Make the zombie move toward the player.
6. Allow the player to move away.
7. Decide what happens when the zombie reaches the player.

### Clash Royale vertical slice

1. Create an empty arena.
2. Place one friendly unit.
3. Place one enemy tower.
4. Store their positions.
5. Make the unit identify the tower as its target.
6. Make the unit move toward the tower.
7. Stop the unit when it reaches attack range.
8. Reduce the tower’s health over time.
9. Remove or disable the tower when its health reaches zero.

---

## Step 8: Reflect before expanding

After the smallest version works, answer:

* What did I learn?
* What part do I understand clearly now?
* What still feels magical or unclear?
* What failed?
* What is the next required dependency?
* What feature would add the most learning value?
* Am I adding this feature because it is necessary or because it sounds exciting?

Only choose one next dependency.

---

# Current Smallest Version

## Core experience

The player should be able to:

> [Write one interaction.]

## Required objects

* [Object one]
* [Object two]
* [Object three]

## Smallest test

I will know this works when:

> [Write one observable result.]

## Not Yet

* [Excluded feature]
* [Excluded feature]
* [Excluded feature]

## Next dependency

After the smallest version works, I will add:

> [Only one next system.]
