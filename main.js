import { Overworld } from "./src/js/World/Overworld.js";

const gamepads = {};

(function () {
  const overworld = new Overworld(document.querySelector('.game-container'));
  overworld.init();
  InitGamePadEvents();
})();

function gamepadHandler(event, connected) {
  const gamepad = event.gamepad;
  // Note:
  // gamepad === navigator.getGamepads()[gamepad.index]

  if (connected) {
    gamepads[gamepad.index] = gamepad;
  } else {
    delete gamepads[gamepad.index];
  }
}

function InitGamePadEvents() {
  window.addEventListener(
    "gamepadconnected",
    (e) => {
      gamepadHandler(e, true);
      console.log("GamePad connected : ", e);
      console.log(gamepads);
    },
    false,
  );
  window.addEventListener(
    "gamepaddisconnected",
    (e) => {
      gamepadHandler(e, false);
      console.log("Gamepad disconnected : ", e.gamepad.index, e.gamepad.id);
      console.log(gamepads);
    },
    false,
  );
}