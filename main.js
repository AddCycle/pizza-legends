import { Overworld } from "./Overworld.js";

(function () {
  const overworld = new Overworld(document.querySelector('.game-container'));
  overworld.init();
})();