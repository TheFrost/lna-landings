import { EventEmitter } from 'events';
import * as PIXI from 'pixi.js';

const loader = PIXI.loader;
const resources = PIXI.loader.resources;

export default class Flock extends EventEmitter {
  constructor() {
    super();

    this.size = {
      width: 768,
      height: 432,
    };

    this.vars = {
      asset: 'images/wint.png',
      delta: 0,
      originalVertices: [],
    };

    this.app = new PIXI.Application(this.size.width, this.size.height, {
      transparent: true, resolution: window.devicePixelRatio || 1,
    });
    this.domNode = document.querySelector('.pw-flock-webgl');
    this.domNode.appendChild(this.app.view);

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    // this.loadAssets();

    this.loop = this.loop.bind(this);
  }

  loadAssets() {
    loader.add([this.vars.asset]).load(() => this.render());
  }

  render() {
    this.emit('ready');

    const texture = resources[this.vars.asset].texture;

    this.mesh = new PIXI.mesh.Plane(texture, 20, 20);
    this.mesh.width = texture.width;
    this.mesh.height = texture.height;

    this.vars.originalVertices = this.mesh.vertices.slice(0);

    this.mesh.scale.set(0.9);

    this.container.addChild(this.mesh);

    this.container.x = (this.app.renderer.width - this.container.width) / 2;
    this.container.y = (this.app.renderer.height - this.container.height) / 2;

    this.app.ticker.add(this.loop);
  }

  loop() {
    this.vars.delta += 0.06;
    if (this.mesh && this.mesh.vertices) {
      for (let i = 0, len = this.mesh.vertices.length; i < len; i += 1) {
        this.mesh.vertices[i] = this.vars.originalVertices[i] +
        (2 * Math.cos(this.vars.delta + i * 0.15));
      }
    }
  }
}
