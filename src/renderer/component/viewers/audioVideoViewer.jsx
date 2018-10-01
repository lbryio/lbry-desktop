// @flow
import React from 'react';
import { stopContextMenu } from 'util/contextMenu';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import toBlobURL from 'stream-to-blob-url';
import fs from 'fs';
import stream from 'stream';
import GrowingFile from 'growing-file';

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

    this.blobStream = new stream.PassThrough();
    this.fileInterval = null;
  }

  componentDidMount() {
    const { source, contentType, poster, fileInfo } = this.props;
    const { downloadPath, fileName } = source;

    const indexOfFileName = downloadPath.indexOf(fileName);
    const basePath = downloadPath.slice(0, indexOfFileName);
    const encodedFileName = encodeURIComponent(fileName);

    const file = GrowingFile.open(downloadPath);
    file.pipe(this.blobStream);

    setInterval(() => {
      console.log("this.blobstream", this.blobStream)
    }, 2000)

    //
    // setInterval(() => {
    //   let data = fs.statSync(downloadPath);
    //   console.log("data", data)
    // }, 1000)

    // var input = fs.createReadStream(downloadPath);
    //
    // input.on('data', function(data) {
    //    // after closing the stream, this will not
    //    // be called again
    //    console.log("new data", data);
    //    blobStream.push(data);
    // });



    // const { size } = fs.statSync(downloadPath);
    // // let blobStart = 0;
    // // let blobEnd = size;
    //
    // // determine initial blob size
    // console.log("size: ", size)
    // let blobStart;
    // let blobEnd;
    //
    // let readStream;
    //
    // const updateBlobStream = (start, end) => {

      // if (blobStart === blobEnd) {
      //   // console.log("trying to write but no new data")
      //   debugger;
      //   return;
      // }
      //
      // if (start === blobStart && end !== blobEnd) {
      //   // console.log("new data loaded, but we need to finish writing")
      //   debugger;
      //   return;
      // }


      // debugger;
      // if (start !== end) {
        // readStream = fs.createReadStream(downloadPath, { start, end: end - 1 })
        // readStream.on('data', (data) => {
        //   this.blobStream.push(data)
        //   console.log("pushed data")
        //   blobStart = end;
        //
        //   // If we haven't mounted the video player yet do it
        //   if (!this.player) {
        //     console.log("no player, generate blob url")
        //     toBlobURL(this.blobStream, (err, url) => {
        //       if (err) return console.error(err.message)
        //       console.log('bloburl: ', url);
        //
        //       const sources = [
        //         {
        //           src: url,
        //           type: contentType
        //         }
        //       ]
        //
        //       const videoJsOptions = {
        //         autoplay: true,
        //         controls: true,
        //         preload: 'none',
        //         poster,
        //         sources,
        //       };
        //       console.log("mount video player")
        //       this.player = videojs(this.videoNode, videoJsOptions, () => {});
        //     });
        //   }
        // });

      // }
    // }
    //
    // updateBlobStream(0, size);


    // this.fileInterval = setInterval(() => {
    //   const newSize = fs.statSync(downloadPath).size;
    //   console.log("newSize: ", newSize)
    //   console.log("this.blobStream", this.blobStream._readableState.length);
    //   if (newSize > this.blobStream._readableState.length) {
    //     console.log("new data we can add")
    //     blobEnd = newSize;
    //     updateBlobStream(blobStart, newSize);
    //   }
    //
    // }, 5000)

    // fs.createReadStream(downloadPath, { start: 0, end: blobEnd - 1 }, (data) => {
    //   blobStream.push(data);
    //   blobStart = blobEnd;
    //   console.log("data", data)
    //
    //   // We have the initial data to start streaming
    //   toBlobURL(blobStream, (err, url) => {
    //     if (err) return console.error(err.message)
    //     console.log('bloburl: ', url);
    //
    //     const sources = [
    //       {
    //         src: url,
    //         type: contentType
    //       }
    //     ]
    //
    //     const videoJsOptions = {
    //       autoplay: true,
    //       controls: true,
    //       preload: 'none',
    //       poster,
    //       sources,
    //     };
    //
    //     this.player = videojs(this.videoNode, videoJsOptions, () => {});
    // });



  // })
  // console.log("fileInfo", fileInfo)


  // let fileStream = fs.createReadStream(downloadPath);
    // fs.readSync(downloadPath, this.bytesSent, this.lastBytesWritten, (data) => {
    //
    //   this.blobStream.push(data);
    //   this.bytesSent = this.lastBytesWritten;
    //
    //   toBlobURL(blobStream, (err, url) => {
    //     if (err) return console.error(err.message)
    //     console.log('bloburl: ', url);
    //
    //     const sources = [
    //       {
    //         src: url,
    //         type: contentType
    //       }
    //     ]
    //
    //     const videoJsOptions = {
    //       autoplay: true,
    //       controls: true,
    //       preload: 'none',
    //       poster,
    //       sources,
    //     };
    //
    //     this.player = videojs(this.videoNode, videoJsOptions, () => {});
    //   })
    // })
  }
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
// }
  componentDidUpdate(prevProps) {
    //

    if (!prevProps.fileInfo.completed && this.props.fileInfo.completed) {
      this.blobStream.push(null);
      clearInterval(this.fileInterval);
    }
    // const { downloadPath } = this.props;
    //
    // const { written_bytes: writtenBytes } = this.props.fileInfo;
    //
    //
    // if (this.lastBytesWritten < writtenBytes) {
    //   console.log("new data");
    //   fs.readSync(downloadPath, lastBytesWritten, writtenBytes, (data) => {
    //     console.log("push to stream")
    //     this.blobStream.push(data);
    //   })
    // }
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
