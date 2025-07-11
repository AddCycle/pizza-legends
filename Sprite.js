export class Sprite {
  constructor(config) {

    // actual sprite image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // shadow below
    this.shadow = new Image();
    // this.useShadow = config.useShadow || false;
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = './src/assets/characters/shadow.png';
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    this.animations = config.animations || {
      idleDown: [
        [0, 0]
      ],
      walkDown: [
        [0, 0]
      ],
    }
    this.currentAnimation = config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;

    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x * 16 - 8;
    const y = this.gameObject.y * 16 - 18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
    this.isLoaded && ctx.drawImage(this.image,
      0,
      0,
      32,
      32,
      x,
      y,
      32,
      32);
  }
}