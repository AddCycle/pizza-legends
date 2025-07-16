import { utils } from "../utils.js";

export class PlayerState {
  constructor() {
    this.pizzas = {
      "p1": {
        pizzaId: "s001",
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null
      },
      // "p2": {
      //   pizzaId: "v001",
      //   hp: 1,
      //   maxHp: 30,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      // },
      // "p3": {
      //   pizzaId: "f001",
      //   hp: 1,
      //   maxHp: 70,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 2,
      //   status: null,
      // }
    };
    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverHp", instanceId: "item1" },
      { actionId: "item_recoverStatus", instanceId: "item2" },
      { actionId: "item_recoverStatus", instanceId: "item3" },
    ];

    this.storyFlags = {};
  }

  addPizza(pizzaId) {
    const newId = `p${Date.now()}` + Math.floor(Math.random() * 99999);
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxHp: 100,
      level: 1,
      status: null
    };

    // TODO : change the max pizzas of the player in the lineup
    if (this.lineup.length < 3) {
      this.lineup.push(newId);
    }
    utils.emitEvent('LineupChanged');
    console.log(this);
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent('LineupChanged');
  }

  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);

    utils.emitEvent('LineupChanged');
  }
}

export const playerState = new PlayerState();