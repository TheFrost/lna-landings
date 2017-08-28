import tabs from 'tabs';
import browser from './utils/browser';
import Reveal from './ui/reveal';
import VideoPlayer from './ui/video-player';
import Matress from './ui/Matress';
import Header3d from './ui/header3d';


document.addEventListener('DOMContentLoaded', () => {
  if (!browser.isDevice()) {
    const reveal = new Reveal();
    const header3D = new Header3d();
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
