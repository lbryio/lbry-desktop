// @flow
import type { Player } from './videojs';
import videojs from 'video.js';

class TheaterModeButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.addClass('vjs-button--theater-mode');
    this.controlText('Theater Mode');
  }
}

export function addTheaterModeButton(player: Player, toggleVideoTheaterMode: () => void) {
  const controlBar = player.getChild('controlBar');

  const theaterMode = new TheaterModeButton(player, {
    name: 'TheaterModeButton',
    text: 'Theater mode',
    clickHandler: () => {
      toggleVideoTheaterMode();
    },
  });

  controlBar.addChild(theaterMode);
}
