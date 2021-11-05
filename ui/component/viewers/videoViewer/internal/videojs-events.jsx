import * as OVERLAY from './overlays';
import * as KEYCODES from 'constants/keycodes';
import isUserTyping from 'util/detect-typing';

// check if active (clicked) element is part of video div, used for keyboard shortcuts (volume etc)
function activeElementIsPartOfVideoElement() {
  const videoElementParent = document.getElementsByClassName('video-js-parent')[0];
  const activeElement = document.activeElement;
  return videoElementParent.contains(activeElement);
}

function volumeUp(event, playerRef) {
  // dont run if video element is not active element (otherwise runs when scrolling using keypad)
  const videoElementIsActive = activeElementIsPartOfVideoElement();
  const player = playerRef.current;
  if (!player || !videoElementIsActive) return;
  event.preventDefault();
  player.volume(player.volume() + 0.05);
  OVERLAY.showVolumeverlay(player, Math.round(player.volume() * 100));
  player.userActive(true);
}

// eslint-disable-next-line flowtype/no-types-missing-file-annotation
function handleSingleKeyActions(e: KeyboardEvent, playerRef) {

  // if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  // if (e.keyCode === KEYCODES.SPACEBAR || e.keyCode === KEYCODES.K) togglePlay();
  // if (e.keyCode === KEYCODES.F) toggleFullscreen();
  // if (e.keyCode === KEYCODES.M) toggleMute();
  if (e.keyCode === KEYCODES.UP) volumeUp(e, playerRef);
  // if (e.keyCode === KEYCODES.DOWN) volumeDown(e, playerRef);
  // if (e.keyCode === KEYCODES.T) toggleTheaterMode();
  // if (e.keyCode === KEYCODES.L) seekVideo(SEEK_STEP);
  // if (e.keyCode === KEYCODES.J) seekVideo(-SEEK_STEP);
  // if (e.keyCode === KEYCODES.RIGHT) seekVideo(SEEK_STEP_5);
  // if (e.keyCode === KEYCODES.LEFT) seekVideo(-SEEK_STEP_5);
}

function handleKeyDown(e: KeyboardEvent, playerRef, containerRef) {
  const player = playerRef.current;
  const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
  if (!videoNode || !player || isUserTyping()) return;
  handleSingleKeyActions(e, playerRef);
  // handleShiftKeyActions(e);
}

export default () => {

  var curried_function = function(playerRef, containerRef) {
    return function curried_func(e) {
      handleKeyDown(e, playerRef, containerRef);
    };
  };

  return {
    curried_function,
  };
};
