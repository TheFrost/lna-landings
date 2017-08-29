import { EventEmitter } from 'events';
import * as PIXI from 'pixi.js';
import inView from 'in-view';
import classnames from 'classnames';
import Charm from '../utils/charm';

const loader = PIXI.loader;
const resources = PIXI.loader.resources;
const charm = new Charm(PIXI);

export default class Matress extends EventEmitter {
  constructor() {
    super();

    this.size = {
      width: 768,
      height: 432,
    };

    this.vars = {
      selector: '.pw-matress-webgl',
      positions: [{
        from: 210,
        to: 210,
      }, {
        from: 220,
        to: 140,
      }, {
        from: 221,
        to: 80,
      }, {
        from: 200,
        to: 0,
      }],
    };



    this.domNode = document.querySelector(this.vars.selector);
    this.lines = document.querySelector(`${this.vars.selector}__lines`);

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

    this.app.stop();


    this.layers = new PIXI.Container();
    this.app.stage.addChild(this.layers);

    this.loadAssets();

  }

  loadAssets() {
    loader.add([
      '//luuna.mx/media/colchon-landing/capa-mat-04.png',
      '//luuna.mx/media/colchon-landing/capa-mat-03.png',
      '//luuna.mx/media/colchon-landing/capa-mat-02.png',
      '//luuna.mx/media/colchon-landing/capa-mat-01.png',
    ]).load(() => this.render());
  }

  bindEvents() {
    this.onTick = this.onTick.bind(this);

    inView.offset({
      top: 100,
      bottom: 100
    })
    inView(this.getSelector())
      .on('enter', el => {
        this.animate(true);
      })
      .on('exit', el => {
        this.animate(false);
      });

    this.app.ticker.add(this.onTick);
  }

  onTick() {
    charm.update();
  }

  getSelector() {
    return this.vars.selector;
  }

  animate(direction) {
    const layers = this.layers.children;
    const key = direction ? 'to' : 'from';

    const tweens = layers.map((sprite, index) => {
      const target = this.vars.positions[index][key];
      return charm.slide(sprite, 0, target);
    })

    tweens[layers.length - 1].onComplete = () => {
      const lines = classnames('pw-matress-webgl__lines', { [key]: true });
      this.lines.className = `${lines}`;
    }

  }

  render() {
    this.bindEvents();

    const keys = Object.keys(resources)

    // remove 2 assets loaded by ball animation
    keys.splice(0, 1)
    keys.splice(0, 1)

    keys.map((img, i) => {
      const sprite = new PIXI.Sprite(resources[img].texture);
      const { from } = this.vars.positions[i];
      sprite.position.set(0, from);
      return this.layers.addChild(sprite);
    });

    this.layers.x = (this.app.renderer.width - this.layers.width) / 2;

    this.app.start();
  }
}
