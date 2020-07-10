import { webFrame } from 'electron';
const isDev = process.env.NODE_ENV !== 'production';

export const ZOOM = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
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

  switch (action) {
    case ZOOM.INCREMENT:
      webFrame.setZoomFactor(getNextZoomFactor(curFactor, true));
      break;
    case ZOOM.DECREMENT:
      webFrame.setZoomFactor(getNextZoomFactor(curFactor, false));
      break;
    case ZOOM.RESET:
      webFrame.setZoomFactor(ZOOM_DFLT_FACTOR);
      break;
    default:
      if (isDev) throw new Error('changeZoomFactor: unexpected action');
      break;
  }
}
