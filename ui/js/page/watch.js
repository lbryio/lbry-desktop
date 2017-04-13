import React from 'react';
import {Icon, Thumbnail} from '../component/common.js';
import {Link} from '../component/link.js';
import lbry from '../lbry.js';
import LoadScreen from '../component/load_screen.js'

const fs = require('fs');
const VideoStream = require('videostream');

export let Video = React.createClass({
  _isMounted: false,
  _controlsHideDelay: 3000, // Note: this needs to be shorter than the built-in delay in Electron, or Electron will hide the controls before us
  _controlsHideTimeout: null,
  _outpoint: null,

  propTypes: {
    uri: React.PropTypes.string,
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
  start: function() {
    // lbry.getCostInfo(this.props.uri).then(({cost}) => {
    //   lbry.getBalance((balance) => {
    //     if (cost > balance) {
    //       this.setState({
    //         modal: 'notEnoughCredits',
    //         loading: false,
    //       });
    //     } else {
    //       this.startVideo();
    //     }
    //   });
    // // });
    // <Modal contentLabel="Not enough credits" isOpen={this.state.modal == 'notEnoughCredits'} onConfirmed={this.closeModal}>
    //   You don't have enough LBRY credits to pay for this stream.
    // </Modal>
    lbry.get({uri: this.props.uri}).then((fileInfo) => {
      this._outpoint = fileInfo.outpoint;
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
      outpoint: this._outpoint,
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
            <span>this is the world's world loading screen and we shipped our software with it anyway... <br/><br/>{this.state.loadStatusMessage}</span> :
            <video controls id="video" ref="video"></video> :
          <div className="video__cover">
            <Thumbnail src={this.props.metadata.thumbnail} />
            <a className="video__play-button" onClick={this.start}><Icon icon="icon-play" /></a>
          </div>
      }</div>
    );
  }
})
