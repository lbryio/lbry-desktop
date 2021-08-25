// @flow
import type { Player } from './videojs';
import videojs from 'video.js';

class AutoplayNextButton extends videojs.getComponent('Button') {
  constructor(player, options = {}, autoplay) {
    super(player, options, autoplay);
    this.addClass(autoplay ? 'vjs-button--autoplay-next--active' : 'vjs-button--autoplay-next');
    this.controlText(autoplay ? 'Autoplay Next On' : 'Autoplay Next Off');
  }
}

export function addAutoplayNextButton(player: Player, toggleAutoplayNext: () => void, autoplay: boolean) {
  const controlBar = player.getChild('controlBar');

  const autoplayButton = new AutoplayNextButton(
    player,
    {
      name: 'AutoplayNextButton',
      text: __('Autoplay Next'),
      clickHandler: () => {
        toggleAutoplayNext();
      },
    },
    autoplay
  );

  controlBar.addChild(autoplayButton);
}
