// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import toBlobURL from 'stream-to-blob-url';
import fs from 'fs';

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
};

class AudioVideoViewer extends React.PureComponent<Props> {
  componentDidMount() {
    const { source, contentType, poster } = this.props;
    const { downloadPath, fileName } = source;

    const indexOfFileName = downloadPath.indexOf(fileName);
    const basePath = downloadPath.slice(0, indexOfFileName);
    const encodedFileName = encodeURIComponent(fileName);

    // We only want to encode the fileName so forward slashes "/" are handled properly by the file system
    // TODO: Determine changes needed for windows
    const path = `${basePath}${encodedFileName}`;

    // Another alternative, maybe we don't need to do anything in the main electron process?
    // get blob url, then set as source and call videojs()
    // toBlobURL(fs.createReadStream(downloadPath), (err, url) => {
    // if (err) return console.error(err.message)
    // console.log(url);
    // const sources = [
    //   {
    //     src: url,
    //     type: contentType
    //   }
    // ]

    const sources = [
      {
        src: path,
        type: contentType,
      },
    ];

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      preload: 'auto',
      poster,
      sources,
    };

    this.player = videojs(this.videoNode, videoJsOptions, () => {});
    // })
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    const { source } = this.props;
    return (
      <div className="file-render__viewer" onContextMenu={stopContextMenu}>
        <div data-vjs-player>
          <video ref={node => (this.videoNode = node)} className="video-js" />
        </div>
      </div>
    );
  }
}

export default AudioVideoViewer;
