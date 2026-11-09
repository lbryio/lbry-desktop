import type {Player} from './videojs';
import videojs from 'video.js';

class PlayNextButton extends videojs.getComponent('Button') {
  constructor(player: unknown, options = {}) {
    super(player, options);
// @ts-expect-error - TS2339 - Property 'addClass' does not exist on type 'PlayNextButton'.
    this.addClass('vjs-button--play-next');
// @ts-expect-error - TS2339 - Property 'controlText' does not exist on type 'PlayNextButton'.
    this.controlText('Play Next');
  }
}

export function addPlayNextButton(player: Player, playNextURI: () => void) {
  const controlBar = player.getChild('controlBar');

  const playNext = new PlayNextButton(player, {
    name: 'PlayNextButton',
    text: 'Play Next',
    clickHandler: () => {
      playNextURI();
    },
  });

  controlBar.addChild(playNext, {}, 1);
}
