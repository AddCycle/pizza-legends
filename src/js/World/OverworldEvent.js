import { OverworldMaps } from "./Maps.js";
import { SceneTransition } from "./SceneTransition.js";
import { TextMessage } from "../UI/TextMessage.js";
import { utils } from "../utils.js";
import { Battle } from "../Battle/Battle.js";
import { Enemies } from "../Data/enemies.js";
import { PauseMenu } from "../UI/PauseMenu.js";
import { playerState } from "../State/PlayerState.js";
import { CraftingMenu } from "../UI/CraftingMenu.js";

export class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehaviour({
      map: this.map,
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time,
    });

    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandingComplete", completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehaviour({
      map: this.map,
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    });

    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects['hero'].direction);
    }
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector('.game-container'));
  }

  changeMap(resolve) {
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false;
    })
    this.transition(() => this.map.overworld.startMap(OverworldMaps[this.event.map], {
      x: this.event.x,
      y: this.event.y,
      direction: this.event.direction,
    }), resolve);
  }

  transition(callback, resolve) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      callback();
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: (didWin) => {
        resolve(didWin ? "WON_BATTLE" : "LOST_BATTLE");
      }
    });
    this.transition(() => battle.init(document.querySelector('.game-container')), () => null);
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector('.game-container'));
  }

  addStoryFlag(resolve) {
    playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      pizzas: this.event.pizzas,
      onComplete: () => {
        resolve();
      }
    });
    menu.init(document.querySelector('.game-container'));
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    })
  }
}