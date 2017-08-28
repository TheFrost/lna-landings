import classlist from 'classlist';
import { EventEmitter } from 'events';

export default class VideoPlayer extends EventEmitter {
  constructor() {
    super();

    this.vars = {
      isPlaying: false,
      className: '--js-playing',
      eventType: ('touchstart' in window) ? 'touchstart' : 'click',
    };

    console.log(this.vars);

    this.wrapper = document.querySelector('.pw-media');

    if (!this.wrapper) {
      return;
    }

    this.cache();
    this.bindEvents();
  }

  cache() {
    this.video = document.querySelector('#pw-video');
    this.poster = this.wrapper.querySelector('.pw-media__poster');
  }

  bindEvents() {
    this.playPause = this.playPause.bind(this);
    this.onVideoEnded = this.onVideoEnded.bind(this);
    this.poster.addEventListener(this.vars.eventType, this.playPause, false);

    this.video.addEventListener('ended', this.onVideoEnded);
  }

  onVideoEnded() {
    this.vars.isPlaying = false;
    classlist(this.wrapper).remove(this.vars.className);
  }

  playPause(e) {
    e.preventDefault();

    if (!this.vars.isPlaying) {
      classlist(this.wrapper).add(this.vars.className);
      this.video.play();
    } else {
      classlist(this.wrapper).remove(this.vars.className);
      this.video.pause();
    }

    this.vars.isPlaying = !this.vars.isPlaying;
  }

  seekToTime(value) {
    const seekToTime = this.video.currentTime + value;

    if (seekToTime < 0 || seekToTime > this.video.duration) {
      return;
    }
    this.video.currentTime = seekToTime;
  }
}
