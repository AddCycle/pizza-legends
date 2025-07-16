import { OverworldEvent } from "./OverworldEvent.js";
import { utils } from '../utils.js';
import { playerState } from "../State/PlayerState.js";
import { PizzaStone } from "../Objects/PizzaStone.js";
import { Person } from "../Objects/Person.js";

export class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; // live objects
    this.configObjects = config.configObjects; // config objects
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(this.lowerImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(this.upperImage, utils.withGrid(10.5) - cameraPerson.x, utils.withGrid(6) - cameraPerson.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${x}x${y}`]) {
      return true;
    }
    // check for gameObjects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) return true;
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y) return true;
      return false;
    });
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {
      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      if (object.type === "PizzaStone") {
        instance = new PizzaStone(object);
      }
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);
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
      const result = await eventHandler.init();
      if (result === "LOST_BATTLE") {
        // playerState.storyFlags["LOST_BATTLE"] = true;
        break;
      }
    }

    this.isCutscenePlaying = false;

    // INFO : this was a duplicate causing issues
    // resets NPCs to do their idle behaviour
    // Object.values(this.gameObjects).forEach(object => object.doBehaviourEvent(this));
  }

  checkForActionCutscene() {
    const hero = this.gameObjects['hero'];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x}x${object.y}` === `${nextCoords.x}x${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {

      const relevantScenario = match.talking.find(scenario => {
        return (scenario.required || []).every(sf => {
          return playerState.storyFlags[sf];
        })
      });
      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects['hero'];
    const match = this.cutsceneSpaces[`${hero.x}x${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }
}