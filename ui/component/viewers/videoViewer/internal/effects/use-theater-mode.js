/**
 * Videojs "Theater Mode" button.
 *
 * --- How to use ---
 * Apply `useTheaterMode` in your React component. It registers an effect that
 * listens to the given Redux state, and returns a callback for you to mount the
 * custom videojs component.
 *
 * --- Notes ---
 * Usually, custom videojs components can just listen to videojs events, query
 * states from `player` (e.g. player.paused()) and update accordingly. But since
 * the state comes from Redux, there will be a need to listen and pass the info
 * to videojs somehow.
 *
 * Instead of going through an 'effect->css->videojs' trip, we'll just listen to
 * the Redux state through a normal effect to update the component.
 *
 * This file aims to encapsulate both the React and Videojs side of things
 * through a single `useAutoplayNext` call.
 */

// @flow
import React from 'react';
import videojs from 'video.js';
import type { Player } from '../videojs';

// ****************************************************************************
// TheaterModeButton
// ****************************************************************************

class TheaterModeButton extends videojs.getComponent('Button') {
  constructor(player, options = {}) {
    super(player, options);
    this.addClass('vjs-button--theater-mode');
    this.controlText(__('Theater Mode (t)'));
  }
}

function addTheaterModeButton(player: Player, toggleVideoTheaterMode: () => void) {
  const controlBar = player.getChild('controlBar');

  const theaterMode = new TheaterModeButton(player, {
    name: 'TheaterModeButton',
    text: 'Theater mode',
    clickHandler: () => {
      toggleVideoTheaterMode();
    },
  });

  if (controlBar) {
    const existingTheatreModeButton = controlBar.getChild('TheaterModeButton');
    if (existingTheatreModeButton) controlBar.removeChild('TheaterModeButton');
    controlBar.addChild(theaterMode);
  }
}

// ****************************************************************************
// useAutoplayNext
// ****************************************************************************

export default function useTheaterMode(playerRef: any, videoTheaterMode: boolean) {
  React.useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const controlBar = player.controlBar;
      const theaterButton = controlBar.getChild('TheaterModeButton');
      if (theaterButton) {
        theaterButton.controlText(videoTheaterMode ? __('Default Mode (t)') : __('Theater Mode (t)'));
      }
    }
  }, [videoTheaterMode]);

  return addTheaterModeButton;
}
