const prefixes = {
  fullscreenElement: ['fullscreenElement', 'msFullscreenElement', 'mozFullScreenElement', 'webkitFullscreenElement'],
  fullscreenEnabled: ['fullscreenEnabled', 'msFullscreenEnabled', 'mozFullScreenEnabled', 'webkitFullscreenEnabled'],
  requestFullscreen: ['requestFullscreen', 'msRequestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen'],
  exitFullscreen: ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen'],
  fullscreenChange: ['fullscreenChange', 'MSFullscreenChange', 'mozfullscreenchange', 'webkitfullscreenchange'],
};

const getPrefix = () => {
  let prefixIndex = 0;
  // validate prefix
  prefixes.fullscreenEnabled.some((prefix, index) => {
    if (document[prefix] || document[prefix] === false) {
      prefixIndex = index;
      return true;
    }
  });
  // prefix vendor index
  return prefixIndex;
};

export const fullscreenElement = () => {
  const index = getPrefix();
  return prefixes.fullscreenElement[index];
};

export const requestFullscreen = elem => {
  const index = getPrefix();
  const prefix = prefixes.requestFullscreen[index];
  elem[prefix] && elem[prefix]();
};

export const exitFullscreen = () => {
  const index = getPrefix();
  const prefix = prefixes.exitFullscreen[index];
  document[prefix] && document[prefix]();
};

export const onFullscreenChange = (event, callback) => {
  const index = getPrefix();
  const prefix = prefixes.fullscreenChange[index];
  document[`${event}EventListener`](prefix, callback, false);
};
