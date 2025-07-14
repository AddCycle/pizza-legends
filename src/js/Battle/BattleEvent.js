import { TextMessage } from '../UI/TextMessage.js';
import { utils } from '../utils.js';
import { BattleAnimations } from './BattleAnimations.js';
import { SubmissionMenu } from './SubmissionMenu.js';

export class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    const text = this.event.text
      .replace('{CASTER}', this.event.caster?.name)
      .replace('{TARGET}', this.event.target?.name)
      .replace('{ACTION}', this.event.action?.name);

    const message = new TextMessage({
      text,
      onComplete: () => {
        resolve();
      },
    });

    message.init(this.battle.element);
  }

  async stateChange(resolve) {
    const { caster, target, damage, recover, status, action } = this.event;
    let who = this.event.onCaster ? caster : target;

    if (damage) {
      // apply damage
      target.update({
        hp: target.hp - damage,
      })

      // start blinking
      target.pizzaElement.classList.add('battle-damage-blink');
    }

    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) {
        newHp = who.maxHp;
      }
      who.update({
        hp: newHp,
      });
    }

    if (status) {
      who.update({
        status: { ...status },
      });
    }
    if (status === null) {
      who.update({
        status: null
      });
    }

    // wait a little & stop blinking
    await utils.wait(600);
    target.pizzaElement.classList.remove('battle-damage-blink');

    resolve();
  }

  submissionMenu(resolve) {
    const menu = new SubmissionMenu({
      caster: this.event.caster,
      enemy: this.event.enemy,
      onComplete: submission => {
        resolve(submission);
      }
    });
    menu.init(this.battle.element);
  }

  animation(resolve) {
    const ft = BattleAnimations[this.event.animation];
    ft(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}