import type {Player} from './videojs';
import videojs from 'video.js';

class PlayNextButton extends videojs.getComponent('Button') {
  constructor(player: unknown, options = {}) {
    super(player, options);
    this.addClass('vjs-button--play-next');
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
