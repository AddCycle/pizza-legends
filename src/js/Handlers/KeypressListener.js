export class KeypressListener {
  constructor(keyCodes, callback) {
    // this.controller = controller;
    let keySafe = true;
    this.keydownFunction = function (event) {
      for (const key in keyCodes) {
        if (((event.code && event.code === keyCodes[key]) || (event.detail && event.detail === keyCodes[key])) && keySafe) {
          keySafe = false;
          callback();
          break;
        }
      }
    };

    this.keyupFunction = function (event) {
      for (const key in keyCodes) {
        if ((event.code && event.code === keyCodes[key]) || (event.detail && event.detail === keyCodes[key])) {
          keySafe = true;
          break;
        }
      }
    };

    document.addEventListener('keydown', this.keydownFunction);
    document.addEventListener('keyup', this.keyupFunction);
    window.addEventListener('gamepadkeydown', this.keydownFunction);
    window.addEventListener('gamepadkeyup', this.keyupFunction);
  }

  unbind() {
    document.removeEventListener('keydown', this.keydownFunction);
    document.removeEventListener('keyup', this.keyupFunction);
    window.addEventListener('gamepadkeyup', this.keydownFunction);
    window.addEventListener('gamepadkeydown', this.keyupFunction);
  }
}