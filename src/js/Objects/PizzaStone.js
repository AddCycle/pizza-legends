import { playerState } from "../State/PlayerState.js";
import { GameObject } from "./GameObject.js";
import { Sprite } from "./Sprite.js";

export class PizzaStone extends GameObject {
  constructor(config) {
    super(config);

    this.sprite = new Sprite({
      gameObject: this,
      src: './src/assets/characters/pizza-stone.png',
      animations: {
        "used-down": [[0, 0]],
        "unused-down": [[1, 0]],
      },
      currentAnimation: "used-down"
    });

    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;
    this.talking = [
      {
        required: [this.storyFlag],
        events: [
          { type: "textMessage", text: "You have already used this." }
        ]
      },
      {
        required: ["TALKED_TO_ERIO"],
        events: [
          { type: "textMessage", text: "Approaching the legendary pizza stone..." },
          { type: "craftingMenu", pizzas: this.pizzas },
          { type: "addStoryFlag", flag: this.storyFlag }
        ]
      },
      {
        events: [
          { type: "textMessage", text: "You will have to talk to Erio..." }
        ]
      },
    ];
  }

  update() {
    this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
      ? "used-down" : "unused-down";
  }
}