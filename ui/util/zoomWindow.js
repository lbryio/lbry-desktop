import { webFrame } from 'electron';
import * as SETTINGS from 'constants/settings';
const isDev = process.env.NODE_ENV !== 'production';

export const ZOOM = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
  LOAD_FROM_LOCAL_STORAGE: 'LOAD_FROM_LOCAL_STORAGE',
};

function getNextZoomFactor(curFactor, isIncreasing) {
  const zoomTable = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];

  curFactor = curFactor.toPrecision(3);
  let i = zoomTable.length;
  while (curFactor < zoomTable[--i]) {}

  if (isIncreasing) {
    return zoomTable[Math.min(zoomTable.length - 1, i + 1)];
  } else {
    return zoomTable[Math.max(0, i - 1)];
  }
}

export function changeZoomFactor(action) {
  const ZOOM_DFLT_FACTOR = 1.0;
  const curFactor = webFrame.getZoomFactor();
  let newFactor = null;

  switch (action) {
    case ZOOM.INCREMENT:
      newFactor = getNextZoomFactor(curFactor, true);
      break;
    case ZOOM.DECREMENT:
      newFactor = getNextZoomFactor(curFactor, false);
      break;
    case ZOOM.RESET:
      newFactor = ZOOM_DFLT_FACTOR;
      break;
    case ZOOM.LOAD_FROM_LOCAL_STORAGE:
      newFactor = parseFloat(window.localStorage.getItem(SETTINGS.DESKTOP_WINDOW_ZOOM));
      if (isNaN(newFactor)) {
        newFactor = ZOOM_DFLT_FACTOR;
      }
      break;
    default:
      if (isDev) throw new Error('changeZoomFactor: unexpected action');
      return;
  }

  webFrame.setZoomFactor(newFactor);
  window.localStorage.setItem(SETTINGS.DESKTOP_WINDOW_ZOOM, newFactor);
}
