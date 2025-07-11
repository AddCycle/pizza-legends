export class Overworld {
  constructor(config) {
    this.element = config;
    this.canvas = document.querySelector('.game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
    const image = new Image();
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };
    image.src = './src/assets/maps/DemoLower.png';

    const x = 5;
    const y = 6;

    const shadow = new Image();
    shadow.onload = () => {
      this.ctx.drawImage(shadow,
        0,
        0,
        32,
        32,
        x * 16 - 8,
        y * 16 - 18,
        32,
        32);
    };
    shadow.src = './src/assets/characters/shadow.png';

    const hero = new Image();
    hero.onload = () => {
      this.ctx.drawImage(hero,
        0,
        0,
        32,
        32,
        x * 16 - 8,
        y * 16 - 18,
        32,
        32);
    };
    hero.src = './src/assets/characters/people/hero.png';


  }
}