export class KeypressListener {
  constructor(callback, ...keyCodes) {
    let keySafe = true;
    this.keydownFunction = function (event) {
      for (const key of keyCodes) {
        if (event.code === key && keySafe) {
          keySafe = false;
          callback();
          break;
        }
      }
    };

    this.keyupFunction = function (event) {
      for (const key of keyCodes) {
        if (event.code === key) {
          keySafe = true;
          break;
        }
      }
    };

    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
  }
}