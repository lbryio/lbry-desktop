import type {Player} from './videojs';
import videojs from 'video.js';

class TheaterModeButton extends videojs.getComponent('Button') {
  constructor(player: unknown, options = {}) {
    super(player, options);
// @ts-expect-error - TS2339 - Property 'addClass' does not exist on type 'TheaterModeButton'.
    this.addClass('vjs-button--theater-mode');
// @ts-expect-error - TS2339 - Property 'controlText' does not exist on type 'TheaterModeButton'.
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
