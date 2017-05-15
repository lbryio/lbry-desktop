import React from 'react';
import FilePrice from 'component/filePrice'
import Link from 'component/link';
import Modal from 'component/modal';

class VideoPlayButton extends React.Component {
  confirmPurchaseClick() {
    this.props.closeModal()
    this.props.startPlaying()
    this.props.loadVideo(this.props.uri)
  }

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
      isLoading,
      costInfo,
      fileInfo,
    } = this.props

    /*
     title={
     isLoading ? "Video is Loading" :
     !costInfo ? "Waiting on cost info..." :
     fileInfo === undefined ? "Waiting on file info..." : ""
     }
     */

    return (<div>
      <Link button={ button ? button : null }
            disabled={isLoading || !costInfo || costInfo.cost === undefined || fileInfo === undefined}
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
        onConfirmed={this.confirmPurchaseClick.bind(this)}
        onAborted={closeModal}>
        Are you sure you'd like to buy <strong>{this.props.metadata.title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits?
      </Modal>
      <Modal
        isOpen={modal == 'timedOut'} onConfirmed={closeModal} contentLabel="Timed Out">
        Sorry, your download timed out :(
      </Modal>
    </div>);
  }
}

const plyr = require('plyr')

class Video extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isPlaying: false }
  }

  onWatchClick() {
    this.props.watchVideo(this.props.uri).then(() => {
      if (!this.props.modal) {
        this.setState({
          isPlaying: true
        })
      }
    })
  }

  startPlaying() {
    this.setState({
      isPlaying: true
    })
  }

  render() {
    const {
      metadata,
      isLoading,
      isDownloading,
      fileInfo,
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
      <div className={"video " + this.props.className + (isPlaying && fileInfo.isReadyToPlay ? " video--active" : " video--hidden")}>{
        isPlaying ?
          (!fileInfo.isReadyToPlay ?
            <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span> :
            <VideoPlayer downloadPath={fileInfo.download_path} />) :
        <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
          <VideoPlayButton onWatchClick={this.onWatchClick.bind(this)}
                     startPlaying={this.startPlaying.bind(this)} {...this.props} />
        </div>
      }</div>
    );
  }
}

class VideoPlayer extends React.PureComponent {
  componentDidMount() {
    const elem = this.refs.video
    const {
      downloadPath,
      contentType,
    } = this.props
    const players = plyr.setup(elem)
    players[0].play()
  }

  render() {
    const {
      downloadPath,
      contentType,
    } = this.props

    return (
      <video controls id="video" ref="video">
        <source src={downloadPath} type={contentType} />
      </video>
    )
  }
}

export default Video