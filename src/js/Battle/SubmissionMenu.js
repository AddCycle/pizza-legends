import { Actions } from '../Data/actions.js';
import { KeyboardMenu } from '../UI/KeyboardMenu.js';

export class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items, replacements }) {
    this.caster = caster;
    this.enemy = enemy;
    this.replacements = replacements;
    this.onComplete = onComplete;

    let quantityMap = {};
    items.forEach(item => {
      if (item.team === caster.team) {
        let existing = quantityMap[item.actionId];
        if (existing) {
          existing.quantity++;
        } else {
          quantityMap[item.actionId] = {
            actionId: item.actionId,
            quantity: 1,
            instanceId: item.instanceId,
          }
        }
      }
    });
    this.items = Object.values(quantityMap);
  }

  getPages() {
    const backOption = {
      label: "Go Back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      }
    };

    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack",
          handler: () => {
            // Do something
            this.keyboardMenu.setOptions(this.getPages().attacks)
          }
        },
        {
          label: "Items",
          description: "Choose an item",
          handler: () => {
            // go to items page
            this.keyboardMenu.setOptions(this.getPages().items);
          }
        },
        {
          label: "Swap",
          description: "Switch to another pizza",
          handler: () => {
            // see pizza options
            this.keyboardMenu.setOptions(this.getPages().replacements);
          }
        }
      ],
      attacks: [
        ...this.caster.actions.map(key => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => {
              this.menuSubmit(action);
            }
          }
        }),
        backOption
      ],
      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description,
            right: () => {
              return "x" + item.quantity;
            },
            handler: () => {
              this.menuSubmit(action, item.instanceId);
            }
          }
        }),
        backOption
      ],
      replacements: [
        ...this.replacements.map(replacement => {
          return {
            label: replacement.name,
            description: replacement.description,
            handler: () => {
              // swaps the pizza
              this.menuSubmitReplacement(replacement);
            }
          }
        }),
        backOption
      ]
    }
  }

  menuSubmitReplacement(replacement) {
    this.keyboardMenu?.end();
    this.onComplete({
      replacement
    });
  }

  menuSubmit(action, instanceId = null) {
    this.keyboardMenu?.end();

    this.onComplete({
      action,
      target: action.targetType === "friendly" ? this.caster : this.enemy,
      instanceId,
    });
  }

  decide() {
    this.menuSubmit(Actions[this.caster.actions[0]]);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      // Show some UI
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}