import { OverworldEvent } from "../World/OverworldEvent.js";
import { Sprite } from "../Objects/Sprite.js";

export class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./src/assets/characters/people/hero.png",
    });

    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;

    this.talking = config.talking || {};
    this.retryTimeout = null;
  }

  mount(map) {
    this.isMounted = true;

    setTimeout(() => {
      this.doBehaviourEvent(map);
    }, 10);
  }

  update() { }

  async doBehaviourEvent(map) {

    if (this.behaviourLoop.length === 0) {
      return;
    }

    if (map.isCutscenePlaying) {
      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }
      this.retryTimeout = setTimeout(() => {
        this.doBehaviourEvent(map);
      }, 1000);
      return;
    }

    let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    this.behaviourLoopIndex++;
    if (this.behaviourLoopIndex === this.behaviourLoop.length) {
      this.behaviourLoopIndex = 0;
    }

    this.doBehaviourEvent(map);
  }
}