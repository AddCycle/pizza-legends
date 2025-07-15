import { Pizzas } from "../Data/pizzas.js";
import { KeypressListener } from "../Handlers/KeypressListener.js";
import { playerState } from "../State/PlayerState.js";
import { KeyboardMenu } from "./KeyboardMenu.js";

export class PauseMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    // case 1: show the default
    if (pageKey === "root") {
      const lineupPizzas = playerState.lineup.map(id => {
        const { pizzaId } = playerState.pizzas[id];
        const base = Pizzas[pizzaId];
        return {
          label: base.name,
          description: base.description,
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions(id))
          }
        }
      })
      return [
        ...lineupPizzas,
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            // we'll do this
          }
        },
        {
          label: "Close",
          description: "Close the pause menu",
          handler: () => {
            this.close();
          }
        }
      ]
    }

    // case 2 : show the option for just one pizza
    const unequipped = Object.keys(playerState.pizzas).filter(id => {
      return playerState.lineup.indexOf(id) === -1;
    }).map(id => {
      const { pizzaId } = playerState.pizzas[id];
      const base = Pizzas[pizzaId];
      return {
        label: `Swap for ${base.name}`,
        description: base.description,
        handler: () => {
          playerState.swapLineup(pageKey, id);
          this.keyboardMenu.setOptions(this.getOptions("root"));
        }
      }
    });

    return [
      ...unequipped,
      {
        label: "Move to the front",
        description: "Move this pizza to the front to the list",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getOptions("root"));
        }
      },
      {
        label: "Back",
        description: "Back to the root menu",
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions("root"));
        }
      }
    ];
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('PauseMenu');
    this.element.classList.add('overlayMenu');
    this.element.innerHTML = (`
      <h2>PauseMenu</h2>
    `);
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    this.esc = new KeypressListener(['Escape'], () => {
      this.close();
    })
  }
}