import React from 'react';
import lbry from '../lbry.js';
import lbryuri from '../lbryuri.js';
import {Icon} from './common.js';

const UriIndicator = React.createClass({
  propTypes: {
    uri: React.PropTypes.string.isRequired,
    hasSignature: React.PropTypes.bool.isRequired,
    signatureIsValid: React.PropTypes.bool,
  },
  render: function() {

    const uriObj = lbryuri.parse(this.props.uri);

    if (!this.props.hasSignature || !uriObj.isChannel) {
      return <span className="empty">Anonymous</span>;
    }

    const channelUriObj = Object.assign({}, uriObj);
    delete channelUriObj.path;
    delete channelUriObj.contentName;
    const channelUri = lbryuri.build(channelUriObj, false);

    let icon, modifier;
    if (this.props.signatureIsValid) {
      modifier = 'valid';
    } else {
      icon = 'icon-times-circle';
      modifier = 'invalid';
    }
    return (
      <span>
        {channelUri} {' '}
        { !this.props.signatureIsValid ?
          <Icon icon={icon} className={`channel-indicator__icon channel-indicator__icon--${modifier}`} /> :
          '' }
      </span>
    );
  }
});

export default UriIndicator;