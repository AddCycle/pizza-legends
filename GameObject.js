import { Sprite } from "./Sprite.js";

export class GameObject {
  constructor(config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "./src/assets/characters/people/hero.png",
    });
  }
}