import { Combatant } from "../Battle/Combatant.js";
import { Pizzas } from "../Data/pizzas.js";
import { playerState } from "../State/PlayerState.js";

export class Hud {
  constructor() {
    this.scoreboards = [];
  }

  update() {
    this.scoreboards.forEach(s => {
      s.update(playerState.pizzas[s.id]);
    });
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Hud');

    playerState.lineup.forEach(key => {
      const pizza = playerState.pizzas[key];
      const scoreboard = new Combatant({
        id: key,
        ...Pizzas[pizza.pizzaId],
        ...pizza,
      }, null);
      scoreboard.createElement();
      this.scoreboards.push(scoreboard);
      this.element.appendChild(scoreboard.hudElement);
    });
    this.update();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    document.addEventListener('PlayerStateUpdated', () => {
      this.update();
    });
  }
}