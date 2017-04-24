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

const WatchLink = React.createClass({
  propTypes: {
    uri: React.PropTypes.string,
    metadata: React.PropTypes.object,
    downloadStarted: React.PropTypes.bool,
    onGet: React.PropTypes.func,
  },
  getInitialState: function() {
    affirmedPurchase: false
  },
  play: function() {
    lbry.get({uri: this.props.uri}).then((streamInfo) => {
      if (streamInfo === null || typeof streamInfo !== 'object') {
        this.setState({
          modal: 'timedOut',
          attemptingDownload: false,
        });
      }

      lbryio.call('file', 'view', {
        uri: this.props.uri,
        outpoint: streamInfo.outpoint,
        claimId: streamInfo.claim_id
      }).catch(() => {})
    });
    if (this.props.onGet) {
      this.props.onGet()
    }
  },
  onWatchClick: function() {
    this.setState({
      loading: true
    });
    lbry.getCostInfo(this.props.uri).then(({cost}) => {
      lbry.getBalance((balance) => {
        if (cost > balance) {
          this.setState({
            modal: 'notEnoughCredits',
            attemptingDownload: false,
          });
        } else if (cost <= 0.01) {
          this.play()
        } else {
          lbry.file_list({outpoint: this.props.outpoint}).then((fileInfo) => {
            if (fileInfo) { // Already downloaded
              this.play();
            } else {
              this.setState({
                modal: 'affirmPurchase'
              });
            }
          });
        }
      });
    });
  },
  getInitialState: function() {
    return {
      modal: null,
      loading: false,
    };
  },
  closeModal: function() {
    this.setState({
      loading: false,
      modal: null,
    });
  },
  render: function() {
    return (<div>
      <Link button={ this.props.button ? this.props.button : null }
            disabled={this.state.loading}
            label={this.props.label ? this.props.label : ""}
            className={this.props.className}
            icon="icon-play"
            onClick={this.onWatchClick} />
      <Modal contentLabel="Not enough credits" isOpen={this.state.modal == 'notEnoughCredits'} onConfirmed={this.closeModal}>
        You don't have enough LBRY credits to pay for this stream.
      </Modal>
      <Modal type="confirm" isOpen={this.state.modal == 'affirmPurchase'}
             contentLabel="Confirm Purchase"  onConfirmed={this.play} onAborted={this.closeModal}>
        Are you sure you'd like to buy <strong>{this.props.metadata.title}</strong> for <strong><FilePrice uri={this.props.uri} metadata={this.props.metadata} label={false} look="plain" /></strong> credits?
      </Modal>
    </div>);
  }
});


const Video = React.createClass({
  _isMounted: false,
  _controlsHideDelay: 3000, // Note: this needs to be shorter than the built-in delay in Electron, or Electron will hide the controls before us
  _controlsHideTimeout: null,

  propTypes: {
    uri: React.PropTypes.string.isRequired,
    metadata: React.PropTypes.object,
    outpoint: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      downloadStarted: false,
      readyToPlay: false,
      isPlaying: false,
      isPurchased: false,
      loadStatusMessage: "Requesting stream... it may sit here for like 15-20 seconds in a really awkward way... we're working on it",
      mimeType: null,
      controlsShown: false,
    };
  },
  onGet: function() {
    lbry.get({uri: this.props.uri}).then((fileInfo) => {
      this.updateLoadStatus();
    });
    this.setState({
      isPlaying: true
    })
  },
  componentDidMount: function() {
    if (this.props.autoplay) {
      this.start()
    }
  },
  handleMouseMove: function() {
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
  },
  handleMouseLeave: function() {
    if (this._controlsTimeout) {
      clearTimeout(this._controlsTimeout);
    }

    if (this.state.controlsShown) {
      this.setState({
        controlsShown: false,
      });
    }
  },
  updateLoadStatus: function() {
    lbry.file_list({
      outpoint: this.props.outpoint,
      full_status: true,
    }).then(([status]) => {
      if (!status || status.written_bytes == 0) {
        // Download hasn't started yet, so update status message (if available) then try again
        // TODO: Would be nice to check if we have the MOOV before starting playing
        if (status) {
          this.setState({
            loadStatusMessage: status.message
          });
        }
        setTimeout(() => { this.updateLoadStatus() }, 250);
      } else {
        this.setState({
          readyToPlay: true,
          mimeType: status.mime_type,
        })
        const mediaFile = {
          createReadStream: function (opts) {
            // Return a readable stream that provides the bytes
            // between offsets "start" and "end" inclusive
            console.log('Stream between ' + opts.start + ' and ' + opts.end + '.');
            return fs.createReadStream(status.download_path, opts)
          }
        };

        rewards.claimNextPurchaseReward()

        var elem = this.refs.video;
        var videostream = VideoStream(mediaFile, elem);
        elem.play();
      }
    });
  },
  render: function() {
    return (
      <div className={"video " + this.props.className + (this.state.isPlaying && this.state.readyToPlay ? " video--active" : " video--hidden")}>{
        this.state.isPlaying ?
          !this.state.readyToPlay  ?
            <span>this is the world's worst loading screen and we shipped our software with it anyway... <br/><br/>{this.state.loadStatusMessage}</span> :
            <video controls id="video" ref="video"></video> :
          <div className="video__cover" style={{backgroundImage: 'url("' + this.props.metadata.thumbnail + '")'}}>
            <WatchLink className="video__play-button" uri={this.props.uri} metadata={this.props.metadata} outpoint={this.props.outpoint} onGet={this.onGet} icon="icon-play"></WatchLink>
          </div>
      }</div>
    );
  }
})

export default Video
