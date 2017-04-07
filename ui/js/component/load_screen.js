import React from 'react';
import lbry from '../lbry.js';
import {BusyMessage, Icon} from './common.js';
import Link from 'component/link'

var LoadScreen = React.createClass({
  propTypes: {
    message: React.PropTypes.string.isRequired,
    details: React.PropTypes.string,
    isWarning: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      isWarning: false,
    }
  },
  getInitialState: function() {
    return {
      message: null,
      details: null,
      isLagging: false,
    }
  },
  render: function() {
    const imgSrc = lbry.imagePath('lbry-white-485x160.png');
    return (
      <div className="load-screen">
        <img src={imgSrc} alt="LBRY"/>
        <div className="load-screen__message">
          <h3>
            <BusyMessage message={this.props.message} />
          </h3>
          {this.props.isWarning ? <Icon icon="icon-warning" /> : null} <span className={'load-screen__details ' + (this.props.isWarning ? 'load-screen__details--warning' : '')}>{this.props.details}</span>
        </div>
      </div>
    );
  }
});


export default LoadScreen;
