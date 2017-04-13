import React from 'react';
import {Icon} from '../component/common.js';
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
      loadStatusMessage: "Requesting stream",
      mimeType: null,
      controlsShown: false,
    };
  },
  componentDidMount: function() {
    lbry.get({uri: this.props.uri}).then((fileInfo) => {
      this._outpoint = fileInfo.outpoint;
      this.updateLoadStatus();
    });
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
        return
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
      <div className={this.props.className}>{
        !this.state.readyToPlay || true  ?
          <span>this is the world's world loading message and we shipped our software with it anyway... seriously it is actually loading... it might take a while though</span> :
          <video className={this.props.className} id="video" ref="video"></video>
      }</div>
    );
  }
})

var WatchPage = React.createClass({
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
      loadStatusMessage: "Requesting stream",
      mimeType: null,
      controlsShown: false,
    };
  },
  componentDidMount: function() {
    lbry.get({uri: this.props.uri}).then((fileInfo) => {
      this._outpoint = fileInfo.outpoint;
      this.updateLoadStatus();
    });
  },
  handleBackClicked: function() {
    history.back();
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
      !this.state.readyToPlay
        ? <LoadScreen message={'Loading video...'} details={this.state.loadStatusMessage} />
        : <main className="video full-screen" onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
            <video controls width="100%" height="100%" id="video" ref="video"></video>
            {this.state.controlsShown
              ? <div className="video__overlay">
                  <div className="video__back">
                    <Link icon="icon-arrow-circle-o-left" className="video__back-link" onClick={this.handleBackClicked}/>
                    <div className="video__back-label">
                      <Icon icon="icon-caret-left" className="video__back-label-arrow" />
                      <div className="video__back-label-content">
                        Back to LBRY
                      </div>
                    </div>
                  </div>
                </div>
              : null}
          </main>
    );
  }
});

export default WatchPage;
