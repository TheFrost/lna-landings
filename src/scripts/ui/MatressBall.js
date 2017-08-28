import { EventEmitter } from 'events';
import * as PIXI from 'pixi.js';

const loader = PIXI.loader;

export default class MatressBall extends EventEmitter {
  constructor() {
    super();

    this.size = {
      width: 1024,
      height: 432,
    };

    this.vars = {
      selector: '.pw-matress-ball-webgl'
    }

    this.domNode = document.querySelector(this.vars.selector);

    if (!this.domNode) {
      return;
    }

    this.init();
  }

  init() {
    this.app = new PIXI.Application(this.size.width, this.size.height, {
      transparent: true,
    });

    this.domNode.appendChild(this.app.view);


    loader.add('images/pw-matress-ball.json')
      .load(() => this.render())
  }

  render() {
    this.emit('loaderReady');

    const frames = [];

    for (let i = 7; i < 30; i++) {
      const val = i < 10 ? '0' + i : i;
      frames.push(PIXI.Texture.fromFrame(`RENDER-REBOTE00${val}.png`));
    }

    const anim = new PIXI.extras.AnimatedSprite(frames)
    anim.x = this.app.renderer.width / 2;
    anim.y = this.app.renderer.height / 2;
    anim.anchor.set(0.5);
    anim.animationSpeed = 0.20;
    anim.play();

    this.app.stage.addChild(anim);
  }
};
