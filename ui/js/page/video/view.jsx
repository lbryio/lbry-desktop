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
      {modal}
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
  constructor(props) {
    super(props)

    // TODO none of this mouse handling stuff seems to actually do anything?
    this._controlsHideDelay = 3000 // Note: this needs to be shorter than the built-in delay in Electron, or Electron will hide the controls before us
    this._controlsHideTimeout = null
    this.state = {}
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

  onWatchClick() {
    this.props.watchVideo().then(() => {
      if (!this.props.modal) {
        this.setState({
          isPlaying: true
        })
      }
    })
  }

  render() {
    const {
      readyToPlay = false,
      thumbnail,
      metadata,
      isLoading,
      isDownloading,
    } = this.props
    const {
      isPlaying = false,
    } = this.state

    let loadStatusMessage = ''

    if (isLoading) {
      loadStatusMessage = "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it"
    } else if (isDownloading) {
      loadStatusMessage = "Downloading stream... not long left now!"
    }

    return (
      <div onMouseMove={this.handleMouseMove.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)} className={"video " + this.props.className + (isPlaying && readyToPlay ? " video--active" : " video--hidden")}>{
        isPlaying ?
          !readyToPlay  ?
            <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span> :
            <VideoPlayer {...this.props} /> :
          <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
            <WatchLink icon="icon-play" onWatchClick={this.onWatchClick.bind(this)} {...this.props}></WatchLink>
          </div>
      }</div>
    );
  }
}

class VideoPlayer extends React.PureComponent {
  componentDidMount() {
    const elem = this.refs.video
    const {
      fileInfo,
    } = this.props
    const mediaFile = {
      createReadStream: (opts) =>
        fs.createReadStream(fileInfo.download_path, opts)
    }
    const videostream = VideoStream(mediaFile, elem)
    elem.play()
  }

  render() {
    return (
      <video controls id="video" ref="video"></video>
    )
  }
}

export default Video
