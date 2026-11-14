const VideoJsFunctions = ({
  source,
  sourceType,
  videoJsOptions,
  isAudio,
}: {
  source: string;
  sourceType: string;
  videoJsOptions: any;
  isAudio: boolean;
}) => {
  function detectFileType() {
    return new Promise(async (res: unknown, rej: unknown) => {
      try {
        const response = await fetch(source, { method: "HEAD", cache: "no-store" });

        // Temp variables to hold results
        let finalType = sourceType;
        let finalSource = source;

        // override type if we receive an .m3u8 (transcoded mp4)
        // do we need to check if explicitly redirected
        // or is checking extension only a safer method
        if (response && response.redirected && response.url && response.url.endsWith("m3u8")) {
          finalType = "application/x-mpegURL";
          finalSource = response.url;
        }

        // Modify video source in options
        videoJsOptions.sources = [
          {
            src: finalSource,
            type: finalType,
          },
        ];

        // @ts-expect-error - TS2349 - This expression is not callable.
        return res(videoJsOptions);
      } catch (error: any) {
        // @ts-expect-error - TS2349 - This expression is not callable.
        return rej(error);
      }
    });
  }

  // TODO: can remove this function as well
  // Create the video DOM element and wrapper
  function createVideoPlayerDOM(container: any) {
    if (!container) return;

    // This seems like a poor way to generate the DOM for video.js
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-vjs-player", "true");
    const el = document.createElement(isAudio ? "audio" : "video");
    el.className = "video-js vjs-big-play-centered ";
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
