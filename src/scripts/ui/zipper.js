import { EventEmitter } from 'events';
import classlist from 'classlist';
import offset from 'offset';
import getMousePosition from '../utils/getMousePosition';
import { clamp, norm } from '../utils/math';

export default class Zipper extends EventEmitter {
  constructor() {
    super();

    this.vars = {
      scrollValue: 0,
      scrollMin: 0,
      scrollMax: 0,
      startMouseX: 0,
      isMouseDown: false,
      lastPosition: 0,
      delta: 0,
      shakeCSS: ['shake', 'animated'],
    };

    this.cache();
    this.bindEvents();
  }

  cache() {
    this.el = document.querySelector('.pw-zipper');
    this.thumb = document.querySelector('.pw-zipper__thumb');
    this.track = document.querySelector('.pw-zipper__track');

    const rectThumb = this.thumb.getBoundingClientRect();
    const rectTrack = this.track.getBoundingClientRect();

    this.vars.scrollMax = rectTrack.width - rectThumb.width;
  }

  onMouseDown(e) {
    e.preventDefault();

    this.vars.isMouseDown = true;
    classlist(this.thumb).remove(...this.vars.shakeCSS);
    const mouse = getMousePosition(e);

    this.vars.startMouseX = mouse.x;
    this.vars.lastPosition = offset(this.thumb).left - offset(this.el).left;

    document.addEventListener('mouseup', this.onMouseUp, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  onMouseUp() {
    this.vars.isMouseDown = false;
    classlist(this.thumb).add(...this.vars.shakeCSS);

    document.removeEventListener('mouseup', this.onMouseUp, false);
    document.removeEventListener('mousemove', this.onMouseMove, false);
  }

  onMouseMove(e) {
    if (this.vars.isMouseDown) {
      this.updatePosition(e);
      return false;
    }
    return true;
  }

  bindEvents() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.thumb.addEventListener('mousedown', this.onMouseDown, false);

    document.onselectstart = (e) => { e.preventDefault(); return false; };
  }

  updatePosition(e) {
    const mouse = getMousePosition(e);
    const pos = (mouse.x - this.vars.startMouseX);

    this.vars.scrollValue = (this.vars.lastPosition + pos);
    this.vars.scrollValue = clamp(this.vars.scrollValue, this.vars.scrollMin, this.vars.scrollMax);

    this.vars.delta = norm(this.vars.scrollValue, this.vars.scrollMin, this.vars.scrollMax);

    Object.assign(this.thumb.style, {
      left: `${this.vars.scrollValue}px`,
    });

    this.emit('change', this.vars.delta);
  }
}
