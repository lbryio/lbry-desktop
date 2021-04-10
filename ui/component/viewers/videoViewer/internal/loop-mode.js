// @flow
import type { Player } from './videojs';

export function addLoopButton(player: Player, toggleLoop: () => void) {
  var myButton = player.controlBar.addChild('button', {
    text: __('Loop'),
    clickHandler: () => {
      toggleLoop();
    },
  });
  
  // $FlowFixMe
  myButton.addClass('vjs-button--loop');
  // $FlowFixMe
  myButton.setAttribute('title', __('Loop'));
}
