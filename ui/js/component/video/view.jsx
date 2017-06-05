import React from 'react';
import FilePrice from 'component/filePrice'
import Link from 'component/link';
import Modal from 'component/modal';
import lbry from 'lbry'
import {
  Thumbnail,
} from 'component/common'

class VideoPlayButton extends React.Component {
  onPurchaseConfirmed() {
    this.props.closeModal()
    this.props.startPlaying()
    this.props.loadVideo(this.props.uri)
  }

  onWatchClick() {
    this.props.purchaseUri(this.props.uri).then(() => {
      if (!this.props.modal) {
        this.props.startPlaying()
      }
    })
  }

  render() {
    const {
      button,
      label,
      className,
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
      mediaType,
    } = this.props

    /*
     title={
     isLoading ? "Video is Loading" :
     !costInfo ? "Waiting on cost info..." :
     fileInfo === undefined ? "Waiting on file info..." : ""
     }
     */

    const disabled = isLoading || fileInfo === undefined || (fileInfo === null && (!costInfo || costInfo.cost === undefined))
    const icon = mediaType == "image" ? "icon-folder-o" : "icon-play"

    return (<div>
      <Link button={ button ? button : null }
            disabled={disabled}
            label={label ? label : ""}
            className="video__play-button"
            icon={icon}
            onClick={this.onWatchClick.bind(this)} />
      <Modal contentLabel={__("Not enough credits")} isOpen={modal == 'notEnoughCredits'} onConfirmed={closeModal}>
        {__("You don't have enough LBRY credits to pay for this stream.")}
      </Modal>
      <Modal
        type="confirm"
        isOpen={modal == 'affirmPurchaseAndPlay'}
        contentLabel={__("Confirm Purchase")}
        onConfirmed={this.onPurchaseConfirmed.bind(this)}
        onAborted={closeModal}>
        {__("This will purchase")} <strong>{title}</strong> {__("for")} <strong><FilePrice uri={uri} look="plain" /></strong> {__("credits")}.
      </Modal>
      <Modal
        isOpen={modal == 'timedOut'} onConfirmed={closeModal} contentLabel={__("Timed Out")}>
        {__("Sorry, your download timed out :(")}
      </Modal>
    </div>);
  }
}

class Video extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isPlaying: false }
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
      contentType,
    } = this.props
    const {
      isPlaying = false,
    } = this.state

    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0
    const mediaType = lbry.getMediaType(contentType, fileInfo && fileInfo.file_name)

    let loadStatusMessage = ''

    if(fileInfo && fileInfo.completed && !fileInfo.written_bytes) {
      loadStatusMessage = __("It looks like you deleted or moved this file. We're rebuilding it now. It will only take a few seconds.")
    } else if (isLoading) {
      loadStatusMessage = __("Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it")
    } else if (isDownloading) {
      loadStatusMessage = __("Downloading stream... not long left now!")
    }

    let klassName = ""
    if (isLoading || isDownloading) klassName += "video-embedded video"
    if (mediaType === "video") {
      klassName += "video-embedded video"
      klassName += isPlaying ? " video--active" : " video--hidden"
    } else {
      if (!isPlaying) klassName += "video-embedded"
    }
    const poster = metadata.thumbnail

    return (
      <div className={klassName}>{
        isPlaying ?
          (!isReadyToPlay ?
            <span>{__("this is the world's worst loading screen and we shipped our software with it anyway...")} <br /><br />{loadStatusMessage}</span> :
            <VideoPlayer filename={fileInfo.file_name} poster={poster} downloadPath={fileInfo.download_path} mediaType={mediaType} poster={poster} />) :
        <div className="video__cover" style={{backgroundImage: 'url("' + metadata.thumbnail + '")'}}>
          <VideoPlayButton startPlaying={this.startPlaying.bind(this)} {...this.props} mediaType={mediaType} />
        </div>
      }</div>
    );
  }
}

const from = require('from2')
const player = require('render-media')
const fs = require('fs')

class VideoPlayer extends React.Component {
  componentDidMount() {
    const elem = this.refs.media
    const {
      downloadPath,
      filename,
    } = this.props
    const file = {
      name: filename,
      createReadStream: (opts) => {
        return fs.createReadStream(downloadPath, opts)
      }
    }
    player.append(file, elem, {
      autoplay: true,
      controls: true,
    })
  }

  render() {
    const {
      downloadPath,
      mediaType,
      poster,
    } = this.props

    return (
      <div>
        {mediaType === "audio" && <Thumbnail src={poster} className="video-embedded" />}
        <div ref="media" />
      </div>
    )
  }
}

export default Video