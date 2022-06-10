// @flow
import type { Player } from './videojs';
import videojs from 'video.js';

class PlayPreviousButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.addClass('vjs-button--play-previous');
    this.controlText('Play Previous');
  }
}

export function addPlayPreviousButton(player: Player, playPreviousURI: () => void) {
  const controlBar = player.controlBar;

  const playPrevious = new PlayPreviousButton(player, {
    name: 'PlayPreviousButton',
    text: 'Play Previous',
    clickHandler: () => {
      playPreviousURI();
    },
  });

  if (controlBar) {
    controlBar.addChild(playPrevious, {}, 0);
  }
}
