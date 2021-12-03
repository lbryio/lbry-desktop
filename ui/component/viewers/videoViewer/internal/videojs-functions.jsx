// @flow
const VideoJsFunctions = ({
   source,
   sourceType,
   videoJsOptions,
   isAudio,
}: {
  source: string,
  sourceType: string,
  videoJsOptions: Object,
  isAudio: boolean,
}) => {
  function detectFileType() {
    // $FlowFixMe
    return new Promise(async (res, rej) => {
      try {
        const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });

        // Temp variables to hold results
        let finalType = sourceType;
        let finalSource = source;

        // override type if we receive an .m3u8 (transcoded mp4)
        // do we need to check if explicitly redirected
        // or is checking extension only a safer method
        if (response && response.redirected && response.url && response.url.endsWith('m3u8')) {
          finalType = 'application/x-mpegURL';
          finalSource = response.url;
        }

        // Modify video source in options
        videoJsOptions.sources = [
          {
            src: finalSource,
            type: finalType,
          },
        ];

        return res(videoJsOptions);
      } catch (error) {
        return rej(error);
      }
    });
  }

  // TODO: can remove this function as well
  // Create the video DOM element and wrapper
  function createVideoPlayerDOM(container: any) {
    if (!container) return;

    // This seems like a poor way to generate the DOM for video.js
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-vjs-player', 'true');
    const el = document.createElement(isAudio ? 'audio' : 'video');
    el.className = 'video-js vjs-big-play-centered ';
    wrapper.appendChild(el);

    container.appendChild(wrapper);

    return el;
  }

  return {
    detectFileType,
    createVideoPlayerDOM,
  };
};

export default VideoJsFunctions;
