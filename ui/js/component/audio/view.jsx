import React from 'react'
import {
  Thumbnail,
} from 'component/common'
import Link from 'component/link'
import Modal from 'component/modal'
import FilePrice from 'component/filePrice'
import lbry from 'lbry'

const WaveSurfer = require('wavesurfer.js')

class PlayButton extends React.Component {
  onPurchaseConfirmed() {
    this.props.closeModal()
    this.props.startPlaying()
    this.props.loadVideo(this.props.uri)
  }

  onPlayClick() {
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
    } = this.props

    return (<div>
      <Link button={ button ? button : null }
            disabled={isLoading || fileInfo === undefined || (fileInfo === null && (!costInfo || costInfo.cost === undefined))}
            label={label ? label : ""}
            icon="icon-play"
            onClick={this.onPlayClick.bind(this)} />
      {modal}
      <Modal contentLabel="Not enough credits" isOpen={modal == 'notEnoughCredits'} onConfirmed={() => { this.closeModal() }}>
        You don't have enough LBRY credits to pay for this stream.
      </Modal>
      <Modal
        type="confirm"
        isOpen={modal == 'affirmPurchase'}
        contentLabel="Confirm Purchase"
        onConfirmed={this.onPurchaseConfirmed.bind(this)}
        onAborted={closeModal}>
        This will purchase <strong>{title}</strong> for <strong><FilePrice uri={uri} look="plain" /></strong> credits.
      </Modal>
      <Modal
        isOpen={modal == 'timedOut'} onConfirmed={() => { this.closeModal() }} contentLabel="Timed Out">
        Sorry, your download timed out :(
      </Modal>
    </div>);
  }
}

class Audio extends React.Component {
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
      fileInfo,
      isLoading,
      isDownloading,
    } = this.props
    const isReadyToPlay = fileInfo && fileInfo.written_bytes > 0
    const {
      isPlaying = false,
    } = this.state

    let loadStatusMessage
    if (isLoading) {
      loadStatusMessage = "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it"
    } else if (isDownloading) {
      loadStatusMessage = "Downloading stream... not long left now!"
    }

    return (
      <div>
        <div>
          {metadata && !!metadata.thumbnail ? <Thumbnail src={metadata.thumbnail} /> :
            <Thumbnail src={lbry.imagePath('default-album-thumb.png')} />}
        </div>
        {(isPlaying || isLoading) && isReadyToPlay &&
          <AudioPlayer autoplay={isPlaying} downloadPath={fileInfo.download_path} />}
        {(isPlaying || isLoading) && !isReadyToPlay &&
          <span>this is the world's worst loading screen and we shipped our software with it anyway... <br /><br />{loadStatusMessage}</span>}
        {!isPlaying && !isLoading &&
          <section className="card">
            <div className="card__inner">
              <PlayButton startPlaying={this.startPlaying.bind(this)} {...this.props} />
            </div>
          </section>
        }
      </div>
    )
  }
}

class AudioPlayer extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      wavesurfer: null,
    }
  }

  componentDidMount() {
    const elem = this.refs['audio-player']
    const {
      downloadPath,
    } = this.props
    const wavesurfer = WaveSurfer.create({
      container: elem,
      progressColor: 'darkslategray',
      height: 96,
    })
    const playingStarted = this.playingStarted.bind(this)
    const playingPaused = this.paused.bind(this)
    wavesurfer.on('play', playingStarted)
    wavesurfer.on('pause', playingPaused)
    wavesurfer.on('ready', () => wavesurfer.play())
    this.setState({
      wavesurfer,
    })
    // setTimeout(() => wavesurfer.play(), 1000)
    wavesurfer.load(downloadPath)
  }

  componentWillUnmount() {
    this.pause()
  }

  playingStarted() {
    this.setState({
      isPlaying: true,
    })
  }

  paused() {
    this.setState({
      isPlaying: false,
    })
  }

  pause() {
    this.state.wavesurfer.pause()
  }

  play() {
    this.state.wavesurfer.play()
  }

  render() {
    const {
      isPlaying,
    } = this.state

    return(
      <div>
        <section className="card">
          <div className="card__inner">
            <div id="audio-player" ref="audio-player"></div>
          </div>
        </section>
        <section className="card">
          <div className="card__inner">
            {isPlaying &&
              <Link
                button={true}
                icon="icon-pause"
                onClick={this.pause.bind(this)}
              />}
            {!isPlaying &&
              <Link
                button={true}
                icon="icon-play"
                onClick={this.play.bind(this)}
              />}
            </div>
          </section>
      </div>
    )
  }
}

export default Audio
