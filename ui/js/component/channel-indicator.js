import React from 'react';
import lbry from '../lbry.js';
import uri from '../uri.js';
import {Icon} from './common.js';

const ChannelIndicator = React.createClass({
  propTypes: {
    uri: React.PropTypes.string.isRequired,
    claimInfo: React.PropTypes.object.isRequired,
  },
  render: function() {
    const {name, has_signature, signature_is_valid} = this.props.claimInfo;
    if (!has_signature) {
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
    if (!signature_is_valid) {
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