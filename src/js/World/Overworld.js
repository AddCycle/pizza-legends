import { DirectionInput } from "../Handlers/DirectionInput.js";
import { KeypressListener } from "../Handlers/KeypressListener.js";
import { Progress } from "../State/Progress.js";
import { Hud } from "../UI/Hud.js";
import { TitleScreen } from "../UI/TitleScreen.js";
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

      if (!this.map.isPaused) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  bindActionInput() {
    window.addEventListener('contextmenu', event => {
      if (event.button === 2) {
        console.log("PAUSING");
        this.pauseGame();
      }
      event.preventDefault();
    }); // right-click remover on window
    new KeypressListener(['Enter', 'Space'], () => {
      this.map.checkForActionCutscene();
    });
    new KeypressListener(['Escape'], () => {
      this.pauseGame();
    });
  }

  pauseGame() {
    if (!this.map.isCutscenePlaying) {
      this.map.startCutscene([
        { type: "pause" }
      ])
    }
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        // Hero's position changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig, heroInitialState = null) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    if (heroInitialState) {
      const { hero } = this.map.gameObjects;
      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction;
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  async init() {
    const container = document.querySelector('.game-container');

    // creates a new tracker
    this.progress = new Progress();

    // show the title screen
    this.titleScreen = new TitleScreen({
      progress: this.progress,
    });

    const useSaveFile = await this.titleScreen.init(container);

    // potentially load saved data
    let initialHeroState = null;
    if (useSaveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection,
      }
    }

    // load the hud
    this.hud = new Hud();
    this.hud.init(document.querySelector('.game-container'));

    // starts the map
    this.startMap(OverworldMaps[this.progress.mapId], initialHeroState);

    // controls
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      { who: "npcA", type: "walk", direction: "right" },
      { who: "npcA", type: "walk", direction: "down" },
      { who: "npcA", type: "walk", direction: "down" },
      { type: "textMessage", text: "I will crush you...", faceHero: "npcA" },
      { type: "battle", enemyId: "beth" },
      { who: "npcA", type: "walk", direction: "up" },
      { who: "npcA", type: "walk", direction: "up" },
      { who: "npcA", type: "walk", direction: "left" },
      // { type: "changeMap", map: "DemoRoom" },
    ]);
  }
}