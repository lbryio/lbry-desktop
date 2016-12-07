import React from 'react';
import lbry from '../lbry.js';
import {BusyMessage, Icon} from './common.js';

var loadScreenStyle = {
  color: 'white',
  backgroundImage: 'url(' + lbry.imagePath('lbry-bg.png') + ')',
  backgroundSize: 'cover',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}, loadScreenMessageStyle = {
  marginTop: '24px',
  width: '325px',
  textAlign: 'center',
};

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
    var imgSrc = lbry.imagePath('lbry-white-485x160.png');
    return (
      <div className="load-screen" style={loadScreenStyle}>
        <img src={imgSrc} alt="LBRY"/>
        <div style={loadScreenMessageStyle}>
          <h3>
            <BusyMessage message={this.props.message} />
          </h3>
          <Icon icon='icon-warning' style={this.props.isWarning ? {} : { display: 'none' }}/> <span style={ this.state.isWarning ? {} : {'color': '#c3c3c3'} }>{this.props.details}</span>
        </div>
      </div>
    );
  }
});


export default LoadScreen;
