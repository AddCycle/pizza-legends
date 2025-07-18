// TODO : later make a keybinds option
export class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      "ArrowUp": "up",
      "ArrowDown": "down",
      "ArrowLeft": "left",
      "ArrowRight": "right",
      "KeyW": "up",
      "KeyS": "down",
      "KeyA": "left",
      "KeyD": "right"
    }
  }

  controllerHandlerDown(dir) {
    if (dir && this.heldDirections.indexOf(dir) === -1) {
      this.heldDirections.unshift(dir);
    }
  }

  controllerHandlerUp(dir) {
    const index = this.heldDirections.indexOf(dir);
    if (index > -1) {
      this.heldDirections.splice(index, 1);
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  // TODO : add to the game loop the same behavior as those below
  init() {
    document.addEventListener('keydown', (e) => {
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    });

    document.addEventListener('keyup', (e) => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    });
  }
}