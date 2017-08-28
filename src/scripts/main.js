import tabs from 'tabs';
import browser from './utils/browser';
import VideoPlayer from './ui/video-player';
import Matress from './ui/Matress';


document.addEventListener('DOMContentLoaded', () => {
  if (!browser.isDevice()) {
    const matressInView = new Matress();
  }

  const specs = document.querySelector('.tab-container');
  if (!specs) { return; }
  tabs(specs);
  const videoPlayer = new VideoPlayer();
});


/*
import Zipper from './ui/zipper';
import Pillow from './ui/pillow';
import Airstream from './ui/airstream';

const pillow = new Pillow();
//pillow.loadAssets();

const zipper = new Zipper();
zipper.on('change', delta => pillow.updateMask(delta));

const air = new Airstream();
air.on('ready', () => {
  pillow.loadAssets();
});

 */
