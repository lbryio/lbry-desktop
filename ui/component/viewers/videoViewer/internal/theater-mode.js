// @flow
import type { Player } from './videojs';

export function addTheaterModeButton(player: Player, toggleVideoTheaterMode: () => void) {
  var myButton = player.controlBar.addChild('button', {
    text: __('Theater mode'),
    clickHandler: () => {
      toggleVideoTheaterMode();
    },
  });

  // $FlowFixMe
  myButton.addClass('vjs-button--theater-mode');
  // $FlowFixMe
  myButton.setAttribute('title', __('Theater mode'));
}
