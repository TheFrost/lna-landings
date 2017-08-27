import transform from 'prefix';
import getMousePosition from '../utils/getMousePosition';
import { map } from '../utils/math';

export default class Header3d {
  constructor() {
    this.vars = {
      matrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ],
      container: null,
    };

    this.transform = transform('transform');

    this.init();
  }

  init() {
    this.vars
      .container = document.querySelector('.small-header');

    if (!this.vars.container) {
      return;
    }

    this.bindEvents();
  }


  bindEvents() {
    this.moveMouse = this.moveMouse.bind(this);

    window.addEventListener('mousemove', this.moveMouse);
  }

  moveMouse(e) {
    const mouse = getMousePosition(e);
    const targetWidth = window.innerWidth;
    const targetHeight = window.innerHeight;
    const halfWidth = (targetWidth / 2);
    const halfHeight = (targetHeight / 2);

    let centeredXPos = mouse.x - halfWidth;
    let centeredYPos = mouse.y - halfHeight;

    centeredXPos = map(centeredXPos, -halfWidth, halfWidth, Math.PI, 2 * Math.PI);
    centeredYPos = map(centeredYPos, -halfHeight, halfHeight, Math.PI, 2 * Math.PI);

    const alpha = Math.cos(centeredXPos);
    const beta = Math.cos(centeredYPos);

    const wrapper = this.vars.container.querySelector('.small-header__wrapper');

    this.rotateAll(wrapper, this.vars.matrix, beta * 5, alpha * 5, 0);
  }

  rotateAll(target, matrix, x, y, z) {
    x = x * Math.PI / 180;
    y = y * Math.PI / 180;
    z = z * Math.PI / 180;

    const sin = Math.sin;
    const cos = Math.cos;

    matrix[0] = cos(y) * cos(z);
    matrix[1] = -cos(y) * sin(z);
    matrix[2] = sin(y);
    matrix[3] = 0;
    matrix[4] = cos(x) * sin(z) + sin(x) * sin(y) * cos(z);
    matrix[5] = cos(x) * cos(z) - sin(x) * sin(y) * sin(z);
    matrix[6] = -sin(x) * cos(y);
    matrix[7] = 0;
    matrix[8] = sin(x) * sin(z) - cos(x) * sin(y) * cos(z);
    matrix[9] = sin(x) * cos(z) + cos(x) * sin(y) * sin(z);
    matrix[10] = cos(x) * cos(y);
    matrix[11] = 0;

    this.applyTransform(target, matrix);
  }

  applyTransform(target, matrix) {
    const matrix3d = `matrix3d(${matrix.toString()})`;
    target.style[this.transform] = matrix3d;
  }
}
