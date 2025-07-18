export class Controller {
  constructor(directionInput) {
    // button A : 0
    // button B : 1
    // button X : 2
    // button Y : 3
    // up : 12
    // down : 13
    // left : 14
    // right : 15
    this.controllers = {}; // just in order to retrieve the index for later connecting multiple controllers local playing + multiplayer
    this.directionInput = directionInput;
  }

  update() {
    // Gamepad part
    const step = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) {
        return;
      }
      const gp = gamepads[0]; // singleplayer for the moment
      console.log("TOUCHED");
      this.handleDirections(gp.buttons);
      this.handleActions(gp.buttons);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // TODO : refactor this immense if statement
  handleActions(buttons) {
    if (buttons[0].pressed) {
      console.log("pressed A button");
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: 'A' }));
    } else {
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: 'A' }));
    }
    if (buttons[1].pressed) {
      console.log("Pressed B")
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: "B" }));
    } else {
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: "B" }));
    }
    if (buttons[2].pressed) {
      console.log("Pressed X")
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: "X" }));
    } else {
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: "X" }));
    }
    if (buttons[3].pressed) {
      console.log("Pressed Y")
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: "Y" }));
    } else {
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: "Y" }));
    }
  }

  handleDirections(buttons) {
    if (buttons[12].pressed) {
      console.log("Pressed UP")
      this.directionInput.controllerHandlerDown("up");
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: 'UP' }));
    } else {
      this.directionInput.controllerHandlerUp("up");
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: 'UP' }));
    }
    if (buttons[13].pressed) {
      console.log("Pressed DOWN")
      this.directionInput.controllerHandlerDown("down");
      window.dispatchEvent(new CustomEvent("gamepadkeydown", { detail: 'DOWN' }));
    } else {
      this.directionInput.controllerHandlerUp("down");
      window.dispatchEvent(new CustomEvent("gamepadkeyup", { detail: 'DOWN' }));
    }
    if (buttons[14].pressed) {
      console.log("Pressed LEFT")
      this.directionInput.controllerHandlerDown("left");
    } else {
      this.directionInput.controllerHandlerUp("left");
    }
    if (buttons[15].pressed) {
      console.log("Pressed RIGHT")
      this.directionInput.controllerHandlerDown("right");
    } else {
      this.directionInput.controllerHandlerUp("right");
    }
  }

  gamepadHandler(event, connected) {
    const gamepad = event.gamepad;
    console.log(gamepad);

    if (connected) {
      console.log(this.controllers)
      this.controllers[gamepad.index] = gamepad;
    } else {
      delete this.controllers[gamepad.index];
    }
  }

  InitGamepadEvents() {
    window.addEventListener(
      "gamepadconnected",
      (e) => {
        this.gamepadHandler(e, true);
        this.update();
        console.log("GamePad connected : ", e);
        console.log(this.controllers);
      },
      false,
    );
    window.addEventListener(
      "gamepaddisconnected",
      (e) => {
        this.gamepadHandler(e, false);
        console.log("Gamepad disconnected : ", e.gamepad.index, e.gamepad.id);
        console.log(this.controllers);
      },
      false,
    );
  }

  init() {
    this.InitGamepadEvents();
  }
}