// This folder is modified based on the original freezeframe@4.0.0-alpha.7
// https://github.com/ctrl-freaks/freezeframe.js/tree/master/packages/freezeframe/src
// Contains subset of features from the main Freezeframe to reduce bundle size.
import imagesLoaded from 'imagesloaded';

import { isTouch, wrapNode, htmlToNode } from './utils';
import * as templates from './templates';
import { classes } from './classes';
import './styles.scss';

const defaultOptions = {
  responsive: true,
  trigger: 'hover',
  overlay: false,
};

const events = {
  START: 'start',
  STOP: 'stop',
  TOGGLE: 'toggle',
};

class FreezeframeLite {
  items = [];
  $images = [];

  eventListeners = {
    ...Object.values(events).reduce((acc, item) => {
      acc[item] = [];
      return acc;
    }, {}),
  };

  constructor(node) {
    this.options = { ...defaultOptions };
    this.init(node);
  }

  init(node) {
    this.isTouch = isTouch();
    this.capture(node);
    this.load(this.$images);
  }

  capture(node) {
    this.$images = [node];
  }

  load($images) {
    imagesLoaded($images).on('progress', (instance, { img }) => {
      this.setup(img);
    });
  }

  async setup($image) {
    const freeze = this.wrap($image);
    this.items.push(freeze);
    await this.process(freeze);
    this.attach(freeze);
  }

  wrap($image) {
    const $container = htmlToNode(templates.container());
    const $canvas = htmlToNode(templates.canvas());

    if (this.options.responsive) {
      $container.classList.add(classes.RESPONSIVE);
    }

    $image.classList.add(classes.IMAGE);
    $container.appendChild($canvas);
    wrapNode($image, $container);

    return {
      $container,
      $canvas,
      $image,
    };
  }

  process(freeze) {
    return new Promise(resolve => {
      const { $canvas, $image, $container } = freeze;
      const { clientWidth, clientHeight } = $image;

      $canvas.setAttribute('width', clientWidth);
      $canvas.setAttribute('height', clientHeight);

      const context = $canvas.getContext('2d');
      context.drawImage($image, 0, 0, clientWidth, clientHeight);

      $canvas.classList.add(classes.CANVAS_READY);

      $canvas.addEventListener(
        'transitionend',
        () => {
          this.ready($container);
          resolve(freeze);
        },
        {
          once: true,
        }
      );
    });
  }

  ready($container) {
    $container.classList.add(classes.READY);
    $container.classList.add(classes.INACTIVE);
    $container.classList.remove(classes.LOADING_ICON);
  }

  attach(freeze) {
    const { $image } = freeze;

    if (!this.isTouch) {
      $image.addEventListener('mouseenter', () => {
        this.toggleOn(freeze);
        this.emit(events.START, freeze, true);
        this.emit(events.TOGGLE, freeze, true);
      });

      $image.addEventListener('mouseleave', () => {
        this.toggleOff(freeze);
        this.emit(events.START, freeze, false);
        this.emit(events.TOGGLE, freeze, false);
      });
    }
  }

  toggleOff(freeze) {
    const { $container } = freeze;

    if ($container.classList.contains(classes.READY)) {
      $container.classList.add(classes.INACTIVE);
      $container.classList.remove(classes.ACTIVE);
    }
  }

  toggleOn(freeze) {
    const { $container, $image } = freeze;

    if ($container.classList.contains(classes.READY)) {
      $image.setAttribute('src', $image.src);
      $container.classList.remove(classes.INACTIVE);
      $container.classList.add(classes.ACTIVE);
    }
  }

  toggle(freeze) {
    const { $container } = freeze;
    const isActive = $container.classList.contains(classes.ACTIVE);

    if (isActive) {
      this.toggleOff(freeze);
    } else {
      this.toggleOn(freeze);
    }
  }

  emit(event, items, isPlaying) {
    this.eventListeners[event].forEach(cb => {
      cb(items.length === 1 ? items[0] : items, isPlaying);
    });
  }

  on(event, cb) {
    this.eventListeners[event].push(cb);
  }
}

export default FreezeframeLite;
