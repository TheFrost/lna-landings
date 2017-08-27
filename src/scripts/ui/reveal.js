import { EventEmitter } from 'events';
import * as PIXI from 'pixi.js';
import Zipper from './zipper';
import { lerp } from '../utils/math';

const loader = PIXI.loader;
const resources = PIXI.loader.resources;

export default class Reveal extends EventEmitter {
  constructor() {
    super();

    this.size = {
      width: 768,
      height: 432,
    };

    const range = this.size.width / 3;

    this.vars = {
      offsetY: 32,
      range,
    };

    this.domNode = document.querySelector('.pw-webgl-mount');

    if (!this.domNode) {
      return;
    }

    this.app = new PIXI.Application(this.size.width, this.size.height, {
      transparent: true });

    this.domNode.appendChild(this.app.view);

    this.layers = new PIXI.Container();
    this.followers = new PIXI.Container();

    this.app.stage.addChild(this.layers);
    this.app.stage.addChild(this.followers);

    this.zipper = new Zipper();

    this.loadAssets();
  }

  loadAssets() {
    loader.add([
      '//luuna.mx/media/pillow-landing/images/capa-01@1x.png',
      '//luuna.mx/media/pillow-landing/images/capa-02@1x.png',
      '//luuna.mx/media/pillow-landing/images/capa-03@1x.png',
    ]).load(() => this.render());
  }

  createMask() {
    const masker = new PIXI.Graphics();
    masker.beginFill(0x8bc5ff, 1);
    masker.drawRect(0, 0, this.size.width, this.size.height);
    masker.closePath();
    return masker;
  }

  createMaskFollower() {
    const follower = new PIXI.Graphics();
    follower.lineStyle(2, 0x5d6e8a);
    follower.moveTo(-2, 0);
    follower.lineTo(-2, (this.size.height - this.vars.offsetY));

    return follower;
  }

  render() {
    const layer01 = new PIXI.Sprite(resources['//luuna.mx/media/pillow-landing/images/capa-01@1x.png'].texture);
    const layer02 = new PIXI.Sprite(resources['//luuna.mx/media/pillow-landing/images/capa-02@1x.png'].texture);
    const layer03 = new PIXI.Sprite(resources['//luuna.mx/media/pillow-landing/images/capa-03@1x.png'].texture);

    this.mask01 = this.createMask();
    this.mask02 = this.createMask();

    this.follower01 = this.createMaskFollower();
    this.follower02 = this.createMaskFollower();

    layer01.mask = this.mask01;
    layer02.mask = this.mask02;

    layer01.scale.set(0.9);
    layer02.scale.set(0.9);
    layer03.scale.set(0.9);

    this.layers.addChild(layer03);
    this.layers.addChild(layer02);
    this.layers.addChild(layer01);

    this.followers.addChild(this.follower01);
    this.followers.addChild(this.follower02);

    this.layers.x = (this.app.renderer.width - this.layers.width) / 2;
    this.layers.y = (this.app.renderer.height - this.layers.height);

    this.zipper.on('change', delta => this.updateMask(delta));
  }

  updateMask(delta) {
    const pointA = lerp(0, this.vars.range * 2, delta);
    const pointB = lerp(-this.vars.range, this.vars.range, delta);

    this.mask01.clear();
    this.mask01.beginFill(0x50E3C2, 1);
    this.mask01.moveTo(pointA, 0);
    this.mask01.lineTo(this.size.width, 0);
    this.mask01.lineTo(this.size.width, this.size.height);
    this.mask01.lineTo(pointA, this.size.height);
    this.mask01.closePath();

    this.mask02.clear();
    this.mask02.beginFill(0x50E3C2, 1);
    this.mask02.moveTo(pointB, 0);
    this.mask02.lineTo(this.size.width, 0);
    this.mask02.lineTo(this.size.width, this.size.height);
    this.mask02.lineTo(pointB, this.size.height);
    this.mask02.closePath();

    this.follower01.x = pointA;
    this.follower02.x = pointB;
  }
}
