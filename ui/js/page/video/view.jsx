import React from 'react';
import {
  Icon,
  Thumbnail,
  FilePrice
} from 'component/common';
import Link from 'component/link';
import lbry from 'lbry';
import Modal from 'component/modal';
import lbryio from 'lbryio';
import rewards from 'rewards';
import LoadScreen from 'component/load_screen'

const fs = require('fs');
const VideoStream = require('videostream');

class WatchLink extends React.Component {
  render() {
    const {
      button,
      label,
      className,
      onWatchClick,
      metadata,
      metadata: {
        title,
      },
      uri,
      modal,
      closeModal,
      play,
      isLoading,
      costInfo,
      fileInfo,
    } = this.props

    return (<div>
      <Link button={ button ? button : null }
            disabled={isLoading || costInfo.cost == undefined || fileInfo === undefined}
            label={label ? label : ""}
            className="video__play-button"
            icon="icon-play"
            onClick={onWatchClick} />
      <Modal contentLabel="Not enough credits" isOpen={modal == 'notEnoughCredits'} onConfirmed={closeModal}>
        You don't have enough LBRY credits to pay for this stream.
      </Modal>
      <Modal
        type="confirm"
        isOpen={modal == 'affirmPurchase'}
        contentLabel="Confirm Purchase"
        onConfirmed={play}
        onAborted={closeModal}>
        Are you sure you'd like to buy <strong>{this.props.metadata.title}</strong> for <strong><FilePrice uri={uri} metadata={metadata} label={false} look="plain" /></strong> credits?
      </Modal>
      <Modal
        isOpen={modal == 'timedOut'} onConfirmed={closeModal} contentLabel="Timed Out">
        Sorry, your download timed out :(
      </Modal>
    </div>);
  }
}

class Video extends React.Component {
  componentDidMount() {
    if (this.props.autoplay) {
      this.start()
    }
  }
  componentDidUpdate() {
    const {
      readyToPlay,
      isPlaying,
      fileInfo,
    } = this.props
    const elem = this.refs.video

    if (elem && readyToPlay && isPlaying) {
      const mediaFile = {
        createReadStream: (opts) =>
          fs.createReadStream(fileInfo.download_path, opts)
      }
      const videostream = VideoStream(mediaFile, elem)
      elem.addEventListener('error', (error) => console.debug(error))
      elem.play()
    }
  }
  handleMouseMove() {
    if (this._controlsTimeout) {
      clearTimeout(this._controlsTimeout);
    }

    if (!this.state.controlsShown) {
      this.setState({
        controlsShown: true,
      });
    }
    this._controlsTimeout = setTimeout(() => {
      if (!this.isMounted) {
        return;
      }

      this.setState({
        controlsShown: false,
      });
    }, this._controlsHideDelay);
  }

  handleMouseLeave() {
    if (this._controlsTimeout) {
      clearTimeout(this._controlsTimeout);
    }

    if (this.state.controlsShown) {
      this.setState({
        controlsShown: false,
      });
    }
  }

  render() {
    const {
      isPlaying = false,
      readyToPlay = false,
      loadStatusMessage = "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it",
      thumbnail,
      metadata,
      isLoading,
    } = this.props

    return (
      <div className={"video " + this.props.className + (isPlaying && readyToPlay ? " video--active" : " video--hidden")}>{
        isPlaying ?
          !readyToPlay  ?
            <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span> :
            <video controls id="video" ref="video"></video> :
          <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
            <WatchLink icon="icon-play" {...this.props}></WatchLink>
          </div>
      }</div>
    );
  }
}

// const Video = React.createClass({
//   _isMounted: false,
//   _controlsHideDelay: 3000, // Note: this needs to be shorter than the built-in delay in Electron, or Electron will hide the controls before us
//   _controlsHideTimeout: null,

//   propTypes: {
//     uri: React.PropTypes.string.isRequired,
//     metadata: React.PropTypes.object,
//     outpoint: React.PropTypes.string,
//   },
//   getInitialState: function() {
//     return {
//       downloadStarted: false,
//       readyToPlay: false,
//       isPlaying: false,
//       isPurchased: false,
//       loadStatusMessage: "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it",
//       mimeType: null,
//       controlsShown: false,
//     };
//   },
//   onGet: function() {
//     lbry.get({uri: this.props.uri}).then((fileInfo) => {
//       this.updateLoadStatus();
//     });
//     this.setState({
//       isPlaying: true
//     })
//   },
//   componentDidMount: function() {
//     if (this.props.autoplay) {
//       this.start()
//     }
//   },
//   handleMouseMove: function() {
//     if (this._controlsTimeout) {
//       clearTimeout(this._controlsTimeout);
//     }

//     if (!this.state.controlsShown) {
//       this.setState({
//         controlsShown: true,
//       });
//     }
//     this._controlsTimeout = setTimeout(() => {
//       if (!this.isMounted) {
//         return;
//       }

//       this.setState({
//         controlsShown: false,
//       });
//     }, this._controlsHideDelay);
//   },
//   handleMouseLeave: function() {
//     if (this._controlsTimeout) {
//       clearTimeout(this._controlsTimeout);
//     }

//     if (this.state.controlsShown) {
//       this.setState({
//         controlsShown: false,
//       });
//     }
//   },
//   updateLoadStatus: function() {
//     lbry.file_list({
//       outpoint: this.props.outpoint,
//       full_status: true,
//     }).then(([status]) => {
//       if (!status || status.written_bytes == 0) {
//         // Download hasn't started yet, so update status message (if available) then try again
//         // TODO: Would be nice to check if we have the MOOV before starting playing
//         if (status) {
//           this.setState({
//             loadStatusMessage: status.message
//           });
//         }
//         setTimeout(() => { this.updateLoadStatus() }, 250);
//       } else {
//         this.setState({
//           readyToPlay: true,
//           mimeType: status.mime_type,
//         })
//         const mediaFile = {
//           createReadStream: function (opts) {
//             // Return a readable stream that provides the bytes
//             // between offsets "start" and "end" inclusive
//             return fs.createReadStream(status.download_path, opts)
//           }
//         };

//         // rewards.claimNextPurchaseReward()

//         var elem = this.refs.video;
//         var videostream = VideoStream(mediaFile, elem);
//         elem.play();
//       }
//     });
//   },
//   render: function() {
//     return (
//       <div className={"video " + this.props.className + (this.state.isPlaying && this.state.readyToPlay ? " video--active" : " video--hidden")}>{
//         this.state.isPlaying ?
//           !this.state.readyToPlay  ?
//             <span>this is the world's worst loading screen and we shipped our software with it anyway... <br/><br/>{this.state.loadStatusMessage}</span> :
//             <video controls id="video" ref="video"></video> :
//           <div className="video__cover" style={{backgroundImage: 'url("' + this.props.metadata.thumbnail + '")'}}>
//             <WatchLink icon="icon-play" {...this.props}></WatchLink>
//           </div>
//       }</div>
//     );
//   }
// })

export default Video
