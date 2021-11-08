// @flow
import React, { useEffect, useRef, useState } from 'react';

const isDev = process.env.NODE_ENV !== 'production';

const TAP = {
  NONE: 'NONE',
  UNMUTE: 'UNMUTE',
  RETRY: 'RETRY',
};

export default ({ tapToUnmuteRef, tapToRetryRef, setReload, }) => {
  function resolveCtrlText(e) {
    // Override the player's control text. We override to:
    // 1. Add keyboard shortcut to the tool-tip.
    // 2. Override videojs' i18n and use our own (don't want to have 2 systems).
    //
    // Notes:
    // - For dynamic controls (e.g. play/pause), those unfortunately need to be
    // updated again at their event-listener level (that's just the way videojs
    // updates the text), hence the need to listen to 'play', 'pause' and 'volumechange'
    // on top of just 'loadstart'.
    // - videojs changes the MuteToggle text at 'loadstart', so this was chosen
    // as the listener to update static texts.

    const setLabel = (controlBar, childName, label) => {
      const c = controlBar.getChild(childName);
      if (c) {
        c.controlText(label);
      }
    };

    const player = playerRef.current;
    if (player) {
      const ctrlBar = player.getChild('controlBar');
      switch (e.type) {
        case 'play':
          setLabel(ctrlBar, 'PlayToggle', __('Pause (space)'));
          break;
        case 'pause':
          setLabel(ctrlBar, 'PlayToggle', __('Play (space)'));
          break;
        case 'volumechange':
          ctrlBar
            .getChild('VolumePanel')
            .getChild('MuteToggle')
            .controlText(player.muted() || player.volume() === 0 ? __('Unmute (m)') : __('Mute (m)'));
          break;
        case 'fullscreenchange':
          setLabel(
            ctrlBar,
            'FullscreenToggle',
            player.isFullscreen() ? __('Exit Fullscreen (f)') : __('Fullscreen (f)')
          );
          break;
        case 'loadstart':
          // --- Do everything ---
          setLabel(ctrlBar, 'PlaybackRateMenuButton', __('Playback Rate (<, >)'));
          setLabel(ctrlBar, 'QualityButton', __('Quality'));
          setLabel(ctrlBar, 'PlayNextButton', __('Play Next (SHIFT+N)'));
          setLabel(ctrlBar, 'PlayPreviousButton', __('Play Previous (SHIFT+P)'));
          setLabel(ctrlBar, 'TheaterModeButton', videoTheaterMode ? __('Default Mode (t)') : __('Theater Mode (t)'));
          setLabel(ctrlBar, 'AutoplayNextButton', autoplaySetting ? __('Autoplay Next On') : __('Autoplay Next Off'));

          resolveCtrlText({ type: 'play' });
          resolveCtrlText({ type: 'pause' });
          resolveCtrlText({ type: 'volumechange' });
          resolveCtrlText({ type: 'fullscreenchange' });
          break;
        default:
          if (isDev) throw Error('Unexpected: ' + e.type);
          break;
      }
    }
  }

  function onInitialPlay() {
    const player = playerRef.current;
    if (player && (player.muted() || player.volume() === 0)) {
      // The css starts as "hidden". We make it visible here without
      // re-rendering the whole thing.
      showTapButton(TAP.UNMUTE);
    } else {
      showTapButton(TAP.NONE);
    }
  }

  function onVolumeChange() {
    const player = playerRef.current;
    if (player && !player.muted()) {
      showTapButton(TAP.NONE);
    }
  }

  function onError() {
    const player = playerRef.current;
    showTapButton(TAP.RETRY);

    // reattach initial play listener in case we recover from error successfully
    // $FlowFixMe
    player.one('play', onInitialPlay);

    if (player && player.loadingSpinner) {
      player.loadingSpinner.hide();
    }
  }

  // const onEnded = React.useCallback(() => {
  //   if (!adUrl) {
  //     showTapButton(TAP.NONE);
  //   }
  // }, [adUrl]);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const controlBar = player.getChild('controlBar');
      controlBar
        .getChild('TheaterModeButton')
        .controlText(videoTheaterMode ? __('Default Mode (t)') : __('Theater Mode (t)'));
    }
  }, [videoTheaterMode]);


  function unmuteAndHideHint() {
    const player = playerRef.current;
    if (player) {
      player.muted(false);
      if (player.volume() === 0) {
        player.volume(1.0);
      }
    }
    showTapButton(TAP.NONE);
  }

  function retryVideoAfterFailure() {
    const player = playerRef.current;
    if (player) {
      setReload(Date.now());
      showTapButton(TAP.NONE);
    }
  }

  function showTapButton(tapButton) {
    const setButtonVisibility = (theRef, newState) => {
      // Use the DOM to control the state of the button to prevent re-renders.
      if (theRef.current) {
        const curState = theRef.current.style.visibility === 'visible';
        if (newState !== curState) {
          theRef.current.style.visibility = newState ? 'visible' : 'hidden';
        }
      }
    };

    switch (tapButton) {
      case TAP.NONE:
        setButtonVisibility(/*tapToUnmuteRef*/, false);
        setButtonVisibility(tapToRetryRef, false);
        break;
      case TAP.UNMUTE:
        setButtonVisibility(tapToUnmuteRef, true);
        setButtonVisibility(tapToRetryRef, false);
        break;
      case TAP.RETRY:
        setButtonVisibility(tapToUnmuteRef, false);
        setButtonVisibility(tapToRetryRef, true);
        break;
      default:
        if (isDev) throw new Error('showTapButton: unexpected ref');
        break;
    }
  }


  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      const touchOverlay = player.getChild('TouchOverlay');
      const controlBar = player.getChild('controlBar') || touchOverlay.getChild('controlBar');
      const autoplayButton = controlBar.getChild('AutoplayNextButton');

      if (autoplayButton) {
        const title = autoplaySetting ? __('Autoplay Next On') : __('Autoplay Next Off');

        autoplayButton.controlText(title);
        autoplayButton.setAttribute('aria-label', title);
        autoplayButton.setAttribute('aria-checked', autoplaySetting);
      }
    }
  }, [autoplaySetting]);


  // Add various event listeners to player
  player.one('play', onInitialPlay);
  player.on('play', resolveCtrlText);
  player.on('pause', resolveCtrlText);
  player.on('loadstart', resolveCtrlText);
  player.on('fullscreenchange', resolveCtrlText);
  player.on('volumechange', resolveCtrlText);
  player.on('volumechange', onVolumeChange);
  player.on('error', onError);
  player.on('ended', onEnded);


  return {
    detectFileType,
    createVideoPlayerDOM,
  };
};
