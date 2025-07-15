import { Combatant } from "./Combatant.js";
import { Pizzas, PizzaTypes } from "../Data/pizzas.js";
import { TurnCycle } from "./TurnCycle.js";
import { BattleEvent } from "./BattleEvent.js";
import { Team } from "./Team.js";
import { playerState } from "../State/PlayerState.js";
import { Enemies } from "../Data/enemies.js";
import { SceneTransition } from "../World/SceneTransition.js";
import { utils } from "../utils.js";

export class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    console.log(this.enemy);
    this.onComplete = onComplete;

    this.combatants = {};
    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    // dynamically add the player's combatants
    playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", playerState.pizzas[id]);
    });

    // now the enemy team :
    Object.keys(this.enemy.pizzas).forEach(key => {
      this.addCombatant("e_" + key, "enemy", this.enemy.pizzas[key]);
    })

    this.items = [];

    // adds player items
    playerState.items.forEach(item => {
      this.items.push({
        ...item,
        team: "player"
      })
    })
    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant({
      ...Pizzas[config.pizzaId],
      ...config,
      team,
      isPlayerControlled: team === "player"
    }, this);

    // populate first active pizza
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('Battle');
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'./src/assets/characters/people/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
      </div>
      `);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully Maguire");

    Object.keys(this.combatants).forEach(key => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      // Add to correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
      onWinner: async (winner) => {
        if (winner === "player") {
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.level = combatant.level;
            }
          });

          // get rid of the players used items
          playerState.items = playerState.items.filter(item => {
            return !this.usedInstanceIds[item.instanceId];
          });

          // Send signal to update Hud/playerState
          utils.emitEvent("PlayerStateUpdated", { detail: winner === "player" });
        }

        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector('.game-container'), () => {
          this.element.remove();

          sceneTransition.fadeOut();
        });
        await utils.wait(1200); // duration of the transition effect
        this.onComplete();
      }
    });
    this.turnCycle.init();
  }
}