// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import toBlobURL from 'stream-to-blob-url';
import fs from 'fs';
import stream from 'stream';
import GrowingFile from 'growing-file';
// var ffmpeg = require('fluent-ffmpeg');
// var probe = require('node-ffprobe');

type Props = {
  source: {
    downloadPath: string,
    fileName: string,
  },
  contentType: string,
  poster?: string,
};

class AudioVideoViewer extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    this.blobStream = new stream.Writable();
    this.fileInterval = null;
  }

  componentDidMount() {
    const { source, contentType, poster, fileInfo } = this.props;
    const { downloadPath, fileName } = source;

    let mediasource = new MediaSource();
    let sourceBuffer = null;
    let chunks = [];
    let pump = function() {
      if (chunks[0]) {
        let chunk = chunks[0];
        delete chunks[0];
        sourceBuffer.appendBuffer(chunk);
        chunk = null;
      }
    };

    let mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', function(_) {
      sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      sourceBuffer.addEventListener(
        'updateend',
        () => {
          if (chunks[0]) pump();
        },
        false
      );

      // read file
      const file = GrowingFile.open(downloadPath);

      let hasChunks = false;
      file
        .on('data', chunk => {
          // console.log("chunk", chunk)
          sourceBuffer.appendBuffer(chunk);
          console.log('append');

          // video.src = url
        })
        .on('end', () => {
          console.log('end');
        })
        .on('error', err => console.error(error));
    });

    const url = URL.createObjectURL(mediaSource);
    console.log('url', url);
    const sources = [
      {
        src: url,
        type: contentType,
      },
    ];

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      preload: 'none',
      poster,
      sources,
    };
    console.log('mount video player');
    this.player = videojs(this.videoNode, videoJsOptions, () => {});

    //
    // let chunks = [];

    // const appendVideo = () => {
    //
    // }
    // // toBlobURL(file, (err, url) => {
    //   if (err) return console.error(err);
    //
    //   console.log("url", url)
    //         const sources = [
    //           {
    //             src: url,
    //             type: contentType
    //           }
    //         ]
    //
    //         const videoJsOptions = {
    //           autoplay: true,
    //           controls: true,
    //           preload: 'none',
    //           poster,
    //           sources,
    //         };
    //         console.log("mount video player")
    //         this.player = videojs(this.videoNode, videoJsOptions, () => {});
    //
    // })
  }

  componentDidUpdate(prevProps) {}

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
