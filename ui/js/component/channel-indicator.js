import React from 'react';
import lbry from '../lbry.js';
import uri from '../uri.js';
import {Icon} from './common.js';

const ChannelIndicator = React.createClass({
  propTypes: {
    uri: React.PropTypes.string.isRequired,
    hasSignature: React.PropTypes.bool.isRequired,
    signatureIsValid: React.PropTypes.bool,
  },
  render: function() {
    if (!this.props.hasSignature) {
      return null;
    }

    const uriObj = uri.parseLbryUri(this.props.uri);
    if (!uriObj.isChannel) {
      return null;
    }

    const channelUriObj = Object.assign({}, uriObj);
    delete channelUriObj.path;
    const channelUri = uri.buildLbryUri(channelUriObj, false);

    let icon, modifier;
    if (this.props.signatureIsValid) {
      icon = 'icon-check-circle';
      modifier = 'valid';
    } else {
      icon = 'icon-times-circle';
      modifier = 'invalid';
    }
    return (
      <span>
        by <strong>{channelUri}</strong> {' '}
        <Icon icon={icon} className={`channel-indicator__icon channel-indicator__icon--${modifier}`} />
      </span>
    );
  }
});

export default ChannelIndicator;