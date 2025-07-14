export class KeypressListener {
  constructor(keyCodes, callback) {
    let keySafe = true;
    this.keydownFunction = function (event) {
      for (const key in keyCodes) {
        if (event.code === keyCodes[key] && keySafe) {
          keySafe = false;
          callback();
          break;
        }
      }
    };

    this.keyupFunction = function (event) {
      for (const key in keyCodes) {
        if (event.code === keyCodes[key]) {
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