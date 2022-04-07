// @flow
import { FLOATING_PLAYER_CLASS } from './view';

export function getRootEl() {
  return document && document.documentElement;
}

export function getScreenWidth() {
  const rootEl = getRootEl();
  return rootEl ? rootEl.clientWidth : window.innerWidth;
}

export function getScreenHeight() {
  const rootEl = getRootEl();
  return rootEl ? rootEl.clientHeight : window.innerHeight;
}

export function getFloatingPlayerRect() {
  const elem = document.querySelector(`.${FLOATING_PLAYER_CLASS}`);
  return elem ? elem.getBoundingClientRect() : null;
}

export function clampFloatingPlayerToScreen(x: number, y: number) {
  const playerRect = getFloatingPlayerRect();

  let newX = x;
  let newY = y;

  if (playerRect) {
    const screenW = getScreenWidth();
    const screenH = getScreenHeight();

    if (x + playerRect.width > screenW) {
      newX = screenW - playerRect.width;
    } else if (x < 0) {
      newX = 0;
    }

    if (y + playerRect.height > screenH) {
      newY = screenH - playerRect.height;
    } else if (y < 0) {
      newY = 0;
    }
  }

  return { x: newX, y: newY };
}

export function calculateRelativePos(x: number, y: number) {
  return {
    x: x / getScreenWidth(),
    y: y / getScreenHeight(),
  };
}

// Max landscape height = calculates the maximum size the player would be at
// if it was at landscape aspect ratio
export function getMaxLandscapeHeight(width?: number) {
  const windowWidth = width || getScreenWidth();
  const maxLandscapeHeight = (windowWidth * 9) / 16;

  return maxLandscapeHeight;
}

// If a video is higher than landscape, this calculates how much is needed in order
// for the video to be centered in a container at the landscape height
export function getAmountNeededToCenterVideo(height: number, fromValue: number) {
  const minVideoHeight = getMaxLandscapeHeight();
  const timesHigherThanLandscape = height / minVideoHeight;
  const amountNeededToCenter = (height - fromValue) / timesHigherThanLandscape;

  return amountNeededToCenter * -1;
}

export function getPossiblePlayerHeight(height: number, isMobile: boolean) {
  // min player height = landscape size based on screen width (only for mobile, since
  // comment expansion will default to landscape view height)
  const minHeight = getMaxLandscapeHeight();
  const maxPercentOfScreen = isMobile ? 70 : 80;
  // max player height
  const maxHeight = (getScreenHeight() * maxPercentOfScreen) / 100;

  const forceMaxHeight = height < maxHeight ? height : maxHeight;
  const forceMinHeight = isMobile && height < minHeight ? minHeight : forceMaxHeight;

  return forceMinHeight;
}

export function getWindowAngle(cb?: () => void) {
  // iOS
  if (typeof window.orientation === 'number') {
    return window.orientation;
  }
  // Android
  if (screen && screen.orientation && screen.orientation.angle) {
    return window.orientation;
  }
  if (cb) cb();
  return 0;
}

export function isWindowLandscapeForAngle(angle: number) {
  return angle === 90 || angle === 270 || angle === -90;
}
