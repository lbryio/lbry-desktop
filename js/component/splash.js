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
  updateStatus: function(was_lagging=false) {
    lbry.getDaemonStatus(this._updateStatusCallback);
  },
  _updateStatusCallback: function(status) {
    if (status.code == 'started') {
      // Wait until we are able to resolve a name before declaring
      // that we are done.
      // TODO: This is a hack, and the logic should live in the daemon
      // to give us a better sense of when we are actually started
      this.setState({
        details: 'Waiting for name resolution',
        isLagging: false
      });

      lbry.resolveName('one', () => {
        this.props.onLoadDone();
      });
      return;
    }
    this.setState({
      details: status.message + (status.is_lagging ? '' : '...'),
      isLagging: status.is_lagging,
    });
    setTimeout(() => {
      this.updateStatus(status.is_lagging);
    }, 500);
  },
  componentDidMount: function() {
    lbry.connect((connected) => {
      this.updateStatus();
    });
  },
  render: function() {
    return <LoadScreen message={this.props.message} details={this.state.details} isWarning={this.state.isLagging} />;
  }
});

export default SplashScreen;
