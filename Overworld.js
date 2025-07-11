import { DirectionInput } from "./DirectionInput.js";
import { OverworldMap } from "./OverworldMap.js";

export class Overworld {
  constructor(config) {
    this.element = config;
    this.canvas = document.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  startGameLoop() {
    const step = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.map.drawLowerImage(this.ctx);

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
        });
        object.sprite.draw(this.ctx);
      });

      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(step);
    }
    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);

    this.directionInput = new DirectionInput();
    this.directionInput.init();
    this.directionInput.direction;

    this.startGameLoop();
  }
}