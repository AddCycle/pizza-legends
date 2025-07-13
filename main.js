import { Overworld } from "./src/js/World/Overworld.js";

(function () {
  const overworld = new Overworld(document.querySelector('.game-container'));
  overworld.init();
})();