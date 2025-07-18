import { KeypressListener } from "../Handlers/KeypressListener.js";

export class KeyboardMenu {
  constructor(config = {}) {
    this.options = [];
    this.up = null;
    this.down = null;
    this.prevFocus = null;
    this.descriptionContainer = config.descriptionContainer || null;
  }

  setOptions(options) {
    console.log("SETTING OPTIONS")
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      return (`
        <div class="option">
          <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
            ${option.label} 
          </button> 
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
        `);
    }).join('');

    // this is the focus and activation of the button using A button of controller but may lead to further issues
    this.element.querySelectorAll('button').forEach((b) => {
      const enter = (e) => {
        console.log("GAMEPAD KEY DOWN TRIGGERED IN KEYBOARD MENU")
        console.log(e)
        if (e.detail === 'A') {
          const chosenOption = this.options[Number(b.dataset.button)];
          chosenOption.handler();
        }
      };
      window.addEventListener('gamepadkeydown', enter);
      b.addEventListener('click', () => {
        const chosenOption = this.options[Number(b.dataset.button)];
        chosenOption.handler();
      });
      b.addEventListener('mouseenter', () => {
        b.focus();
      });
      b.addEventListener('focus', () => {
        this.prevFocus = b;
        this.descriptionElementText.innerText = b.dataset.description;
      });
    });

    setTimeout(() => {
      this.element.querySelector('button[data-button]:not([disabled])').focus();
    }, 10);
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('KeyboardMenu');

    // description box element
    this.descriptionElement = document.createElement('div');
    this.descriptionElement.classList.add('DescriptionBox');
    this.descriptionElement.innerHTML = (`<p>I will provide information</p>`);
    this.descriptionElementText = this.descriptionElement.querySelector('p');
  }

  end() {
    this.element.remove();
    this.descriptionElement.remove();

    // clean bindings for menu selection
    this.up.unbind();
    this.down.unbind();
  }

  init(container) {
    this.createElement();
    (this.descriptionContainer || container).appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeypressListener(['ArrowUp', 'UP'], () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const prevButton = Array.from(this.element.querySelectorAll('button[data-button]')).reverse().find(elt => {
        return elt.dataset.button < current && !elt.disabled;
      });
      prevButton?.focus();
    });
    this.down = new KeypressListener(['ArrowDown', 'DOWN'], () => {
      const current = Number(this.prevFocus.getAttribute('data-button'));
      const nextButton = Array.from(this.element.querySelectorAll('button[data-button]')).find(elt => {
        return elt.dataset.button > current && !elt.disabled;
      });
      nextButton?.focus();
    });
  }
}