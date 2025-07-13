import { DirectionInput } from "./DirectionInput.js";
import { KeypressListener } from "./KeypressListener.js";
import { OverworldMaps } from "./Maps.js";
import { OverworldMap } from "./OverworldMap.js";

export class Overworld {
  constructor(config) {
    this.element = config;
    this.canvas = document.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  gameLoopStepWork() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const cameraPerson = this.map.gameObjects.hero;

    Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });

    this.map.drawLowerImage(this.ctx, cameraPerson);

    // drawing objects
    Object.values(this.map.gameObjects).sort((a, b) => a.y - b.y).forEach(object => {
      object.sprite.draw(this.ctx, cameraPerson);
    });

    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  startGameLoop() {
    let previous;
    const fpsHz = 1 / 60;

    const step = (timestamp) => {
      if (previous === undefined) {
        previous = timestamp;
      }
      let delta = (timestamp - previous) / 1000;
      while (delta >= fpsHz) {
        // do the work here when we're the same
        this.gameLoopStepWork();
        delta -= fpsHz;
      }
      previous = timestamp - delta * 1000;

      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  bindActionInput() {
    new KeypressListener(() => {
      this.map.checkForActionCutscene();
    }, 'Enter', 'Space');
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        // Hero's position changed
        console.log("NEW HERO POS");
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(OverworldMaps.Kitchen);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      { type: "changeMap", map: "DemoRoom" },
    ]);
  }
}