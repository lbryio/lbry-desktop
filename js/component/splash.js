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
      lbry.getDaemonStatus((status) => {
        if (status.code == 'started') {
          this.props.onLoadDone();
          return;
        }

        this.setState({
          details: status.message + (status.is_lagging ? '' : '...'),
          isLagging: status.is_lagging,
        });

        setTimeout(() => {
          this.updateStatus(status.is_lagging);
        }, 500);
      });
  },
  componentDidMount: function() {
    this.updateStatus();
  },
  render: function() {
    return <LoadScreen message={this.props.message} details={this.state.details} isWarning={this.state.isLagging} />;
  }
});

export default SplashScreen;
