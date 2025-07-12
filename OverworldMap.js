import { GameObject } from "./GameObject.js";
import { OverworldEvent } from "./OverworldEvent.js";
import { Person } from "./Person.js";
import { utils } from './utils.js';

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x}x${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key];
      object.id = key;
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // start a loop of async events and wait for each one
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        map: this,
        event: events[i]
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
  }

  addWall(x, y) {
    this.walls[`${x}x${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x}x${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

const x = utils.withGrid(2);
const y = utils.withGrid(5);

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: './src/assets/maps/DemoLower.png',
    upperSrc: './src/assets/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({ x, y, isPlayerControlled: true }),
      npcA: new Person({
        x: utils.withGrid(7), y: utils.withGrid(9), src: "./src/assets/characters/people/npc1.png",
        behaviourLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "up", time: 800 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(1), y: utils.withGrid(6), src: "./src/assets/characters/people/npc2.png",
        behaviourLoop: [
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "up", time: 300 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "down", time: 600 },
        ]
      }),
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    }
  },
  Kitchen: {
    lowerSrc: './src/assets/maps/KitchenLower.png',
    upperSrc: './src/assets/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({ x, y, isPlayerControlled: true }),
      npcA: new Person({
        x: utils.withGrid(2), y: utils.withGrid(6), src: "./src/assets/characters/people/npc1.png"
      }),
      npcB: new Person({
        x: utils.withGrid(4), y: utils.withGrid(4), src: "./src/assets/characters/people/npc2.png"
      }),
    }
  },
};