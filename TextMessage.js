import { KeypressListener } from "./KeypressListener.js";
import { RevealingText } from "./RevealingText.js";

export class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');
    this.element.innerHTML = (`
    <p class="TextMessage_p"></p>
    <button class="TextMessage_button">Next</button>
      `);

    // Init the typewriter effect
    this.revealingText = new RevealingText({
      element: this.element.querySelector('.TextMessage_p'),
      text: this.text,
    });

    this.element.querySelector('button').addEventListener('click', () => this.done());
    this.actionListener = new KeypressListener(() => this.done() && this.actionListener.unbind(), 'Space', 'Enter');
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    this.revealingText.init();
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }
}