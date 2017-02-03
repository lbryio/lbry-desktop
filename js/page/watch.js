import React from 'react';
import {Icon} from '../component/common.js';
import {Link} from '../component/link.js';
import lbry from '../lbry.js';
import LoadScreen from '../component/load_screen.js'

const fs = require('fs');
const VideoStream = require('videostream');


var WatchPage = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      downloadStarted: false,
      readyToPlay: false,
      loadStatusMessage: "Requesting stream",
      mimeType: null,
    };
  },
  componentDidMount: function() {
    lbry.getStream(this.props.name);
    this.updateLoadStatus();
  },
  handleBackClicked: function() {
    history.back();
  },
  updateLoadStatus: function() {
    lbry.getFileStatus(this.props.name, (status) => {
      if (!status || !['running', 'stopped'].includes(status.code) || status.written_bytes == 0) {
        // Download hasn't started yet, so update status message (if available) then try again
	// TODO: Would be nice to check if we have the MOOV before starting playing
        if (status) {
          this.setState({
            loadStatusMessage: status.message,
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
	}
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
        : <main className="video full-screen">
            <video width="100%" height="100%" id="video" ref="video" src={'/view?name=' + this.props.name} />
            <div className="video__overlay">
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
          </main>
    );
  }
});

export default WatchPage;
