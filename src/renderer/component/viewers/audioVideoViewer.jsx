// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import toBlobURL from 'stream-to-blob-url';
import fs from 'fs';
import stream from 'stream';

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
};

class AudioVideoViewer extends React.PureComponent<Props> {
  constructor() {
    super();

    this.blobStream = new stream.Readable();
  }

  componentDidMount() {
    const { source, contentType, poster, fileInfo } = this.props;
    const { downloadPath, fileName } = source;

    const indexOfFileName = downloadPath.indexOf(fileName);
    const basePath = downloadPath.slice(0, indexOfFileName);
    const encodedFileName = encodeURIComponent(fileName);



  console.log("fileInfo", fileInfo)

  let blobStream = new stream.Readable();

  let fileStream = fs.createReadStream(downloadPath);

  let bytesSent = 0;
  let lastBytesWritten = fileInfo.written_bytes;

  // setInterval(() => {
  //   // There are new bytes
  //   if (lastBytesWritten !== fileInfo.written_bytes) {
  //     fs.readSync(file, bytesSent, lastBytesWritten, (data) => {
  //       console.log("new data")
  //       blobStream.push(data)
  //     });
  //
  //     lastBytesWritten = fileInfo.written_bytes;
  //   } else {
  //     console.log("nothing new")
  //   }
  // }, 500)
  //
  //
  //   toBlobURL(blobStream, (err, url) => {
  //   if (err) return console.error(err.message)
  //   console.log(url);
  //   const sources = [
  //     {
  //       src: url,
  //       type: contentType
  //     }
  //   ]
  //
  //   const videoJsOptions = {
  //     autoplay: true,
  //     controls: true,
  //     preload: 'none',
  //     poster,
  //     sources,
  //   };
  //
  //   this.player = videojs(this.videoNode, videoJsOptions, () => {});
    // })
  }

  componentDidUpdate(prevProps) {

    const { written_bytes: previousWrittenBytes } = prevProps.fileInfo;
    const { written_bytes: writtenBytes } = this.props;
    if (previousWrittenBytes < writtenBytes) {
      console.log("push to stream");
    }
    // check if we can push new data to the stream
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
