// @flow
const VideoJsFunctions = ({ isAudio }: { isAudio: boolean }) => {
  // TODO: can remove this function as well
  // Create the video DOM element and wrapper
  function createVideoPlayerDOM(container: any) {
    if (!container) return;

    // This seems like a poor way to generate the DOM for video.js
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-vjs-player', 'true');
    const el = document.createElement('video');
    el.className = 'video-js vjs-big-play-centered ';
    wrapper.appendChild(el);

    container.appendChild(wrapper);

    return el;
  }

  return {
    createVideoPlayerDOM,
  };
};

export default VideoJsFunctions;
