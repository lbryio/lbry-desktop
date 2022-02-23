// @flow
import { FLOATING_PLAYER_CLASS } from './view';

function getRootEl() {
  return document && document.documentElement;
}

export function getScreenWidth() {
  const mainEl = getRootEl();
  return mainEl ? mainEl.clientWidth : window.innerWidth;
}

export function getScreenHeight() {
  const mainEl = getRootEl();
  return mainEl ? mainEl.clientHeight : window.innerHeight;
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
