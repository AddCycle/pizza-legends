import { GameObject } from "./GameObject.js";

export class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

const x = 2;
const y = 5;
window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: './src/assets/maps/DemoLower.png',
    upperSrc: './src/assets/maps/DemoUpper.png',
    gameObjects: {
      hero: new GameObject({ x, y }),
      npcA: new GameObject({
        x: 7, y: 9, src: "./src/assets/characters/people/npc1.png"
      }),
      npcB: new GameObject({
        x: 1, y: 6, src: "./src/assets/characters/people/npc2.png"
      }),
    }
  },
  Kitchen: {
    lowerSrc: './src/assets/maps/KitchenLower.png',
    upperSrc: './src/assets/maps/KitchenUpper.png',
    gameObjects: {
      hero: new GameObject({ x, y }),
      npcA: new GameObject({
        x: 2, y: 6, src: "./src/assets/characters/people/npc1.png"
      }),
      npcB: new GameObject({
        x: 4, y: 4, src: "./src/assets/characters/people/npc2.png"
      }),
    }
  },
};