import { KeyboardMenu } from "./KeyboardMenu.js";

export class TitleScreen {
  constructor({ progress }) {
    this.progress = progress;
  }

  getOptions(resolve) {
    const saveFile = this.progress.getSaveFile();
    return [
      {
        label: "New Game",
        description: "Start a new pizza adventure!",
        handler: () => {
          this.close();
          resolve();
        }
      },
      saveFile ? {
        label: "Continue Game",
        description: "Resume your adventure",
        handler: () => {
          this.close();
          resolve(saveFile);
        }
      } : null
    ].filter(v => v);
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('TitleScreen');
    this.element.innerHTML = (`
      <img class="TitleScreen_logo" src="./src/assets/logo.png" alt="Pizza Legends" />   
    `);
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container) {
    return new Promise(resolve => {
      this.createElement();
      container.appendChild(this.element);
      this.keyboardMenu = new KeyboardMenu();
      this.keyboardMenu.init(this.element);
      this.keyboardMenu.setOptions(this.getOptions(resolve));
    })
  }
}