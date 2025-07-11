import { GameObject } from "./GameObject.js";

export class Overworld {
  constructor(config) {
    this.element = config;
    this.canvas = document.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = './src/assets/maps/DemoLower.png';

    const x = 5;
    const y = 6;

    const hero = new GameObject({ x, y });
    const npc = new GameObject({
      x: 7, y: 9, src: "./src/assets/characters/people/npc1.png"
    });

    setTimeout(() => {
      hero.sprite.draw(this.ctx);
      npc.sprite.draw(this.ctx);
    }, 200);
  }
}