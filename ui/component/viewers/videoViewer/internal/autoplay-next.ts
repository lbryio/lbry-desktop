import type {Player} from './videojs';
import videojs from 'video.js';

class AutoplayNextButton extends videojs.getComponent('Button') {
  constructor(player: unknown, options = {}, autoplayNext: unknown) {
    super(player, options, autoplayNext);
    const title = autoplayNext ? 'Autoplay Next On' : 'Autoplay Next Off';

// @ts-expect-error - TS2339 - Property 'controlText' does not exist on type 'AutoplayNextButton'.
    this.controlText(title);
// @ts-expect-error - TS2339 - Property 'setAttribute' does not exist on type 'AutoplayNextButton'.
    this.setAttribute('aria-label', title);
// @ts-expect-error - TS2339 - Property 'addClass' does not exist on type 'AutoplayNextButton'.
    this.addClass('vjs-button--autoplay-next');
// @ts-expect-error - TS2339 - Property 'setAttribute' does not exist on type 'AutoplayNextButton'.
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
