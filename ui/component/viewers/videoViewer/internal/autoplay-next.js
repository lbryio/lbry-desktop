// @flow
import type { Player } from './videojs';
import videojs from 'video.js';

class AutoplayNextButton extends videojs.getComponent('Button') {
  constructor(player, options = {}, autoplayNext) {
    super(player, options, autoplayNext);
    const title = autoplayNext ? 'Autoplay Next On' : 'Autoplay Next Off';

    this.controlText(title);
    this.setAttribute('aria-label', title);
    this.addClass('vjs-button--autoplay-next');
    this.setAttribute('aria-checked', autoplayNext);
  }
}

export function addAutoplayNextButton(player: Player, toggleAutoplayNext: () => void, autoplayNext: boolean) {
  const controlBar = player.getChild('controlBar');

  const autoplayButton = new AutoplayNextButton(
    player,
    {
      name: 'AutoplayNextButton',
      text: 'Autoplay Next',
      clickHandler: () => {
        toggleAutoplayNext();
      },
    },
    autoplayNext
  );

  controlBar.addChild(autoplayButton);
}
