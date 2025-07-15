import { OverworldMaps } from "./Maps.js";
import { SceneTransition } from "./SceneTransition.js";
import { TextMessage } from "../UI/TextMessage.js";
import { utils } from "../utils.js";
import { Battle } from "../Battle/Battle.js";
import { Enemies } from "../Data/enemies.js";
import { PauseMenu } from "../UI/PauseMenu.js";

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
      text: typeof this.event.text === "function" ? this.event.text() : this.event.text,
      onComplete: () => resolve(),
    });
    message.init(document.querySelector('.game-container'));
  }

  changeMap(resolve) {
    this.transition(() => this.map.overworld.startMap(OverworldMaps[this.event.map]), resolve);
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
      onComplete: () => {
        resolve();
      }
    });
    this.transition(() => battle.init(document.querySelector('.game-container')), () => null);
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
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