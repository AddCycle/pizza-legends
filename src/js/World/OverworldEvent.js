import { OverworldMaps } from "./Maps.js";
import { SceneTransition } from "./SceneTransition.js";
import { TextMessage } from "../UI/TextMessage.js";
import { utils } from "../utils.js";
import { Battle } from "../Battle/Battle.js";
import { Enemies } from "../Data/enemies.js";

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
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector('.game-container'), () => {
      this.map.overworld.startMap(OverworldMaps[this.event.map]);
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve) {
    console.log(this.event);
    console.log(this.event.enemyId);
    console.log(Enemies[this.event.enemyId]);
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: () => {
        resolve();
      }
    });
    battle.init(document.querySelector('.game-container'));
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    })
  }
}