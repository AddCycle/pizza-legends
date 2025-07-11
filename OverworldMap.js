import { GameObject } from "./GameObject.js";
import { Person } from "./Person.js";
import { utils } from './utils.js';

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
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
        x: utils.withGrid(7), y: utils.withGrid(9), src: "./src/assets/characters/people/npc1.png"
      }),
      npcB: new Person({
        x: utils.withGrid(1), y: utils.withGrid(6), src: "./src/assets/characters/people/npc2.png"
      }),
    }
  },
  Kitchen: {
    lowerSrc: './src/assets/maps/KitchenLower.png',
    upperSrc: './src/assets/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({ x, y, isPlayerControlled: true }),
      npcA: new GameObject({
        x: utils.withGrid(2), y: utils.withGrid(6), src: "./src/assets/characters/people/npc1.png"
      }),
      npcB: new GameObject({
        x: utils.withGrid(4), y: utils.withGrid(4), src: "./src/assets/characters/people/npc2.png"
      }),
    }
  },
};