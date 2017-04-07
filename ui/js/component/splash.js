import React from 'react';
import lbry from '../lbry.js';
import LoadScreen from './load_screen.js';

var SplashScreen = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
    onLoadDone: React.PropTypes.func,
  },
  getInitialState: function() {
    return {
      details: 'Starting daemon',
      isLagging: false,
    }
  },
  updateStatus: function() {
    lbry.status().then(this._updateStatusCallback);
  },
  _updateStatusCallback: function(status) {
    const startupStatus = status.startup_status
    if (startupStatus.code == 'started') {
      // Wait until we are able to resolve a name before declaring
      // that we are done.
      // TODO: This is a hack, and the logic should live in the daemon
      // to give us a better sense of when we are actually started
      this.setState({
        details: 'Waiting for name resolution',
        isLagging: false
      });

      lbry.resolve({uri: 'lbry://one'}).then(() => {
        this.props.onLoadDone();
      });
      return;
    }
    this.setState({
      details: startupStatus.message + (startupStatus.is_lagging ? '' : '...'),
      isLagging: startupStatus.is_lagging,
    });
    setTimeout(() => {
      this.updateStatus();
    }, 500);
  },
  componentDidMount: function() {
    lbry.connect().then((isConnected) => {
      if (isConnected) {
        this.updateStatus();
      } else {
        this.setState({
          isLagging: true,
          message: "Failed to connect to LBRY",
          details: "LBRY was unable to start and connect properly."
        })
      }
    })
  },
  render: function() {
    return <LoadScreen message={this.props.message} details={this.state.details} isWarning={this.state.isLagging} />
  }
});

export default SplashScreen;
