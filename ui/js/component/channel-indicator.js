import React from 'react';
import lbry from '../lbry.js';
import uri from '../uri.js';
import {Icon} from './common.js';

const UriIndicator = React.createClass({
  propTypes: {
    uri: React.PropTypes.string.isRequired,
    hasSignature: React.PropTypes.bool.isRequired,
    signatureIsValid: React.PropTypes.bool,
  },
  render: function() {

    const uriObj = uri.parseLbryUri(this.props.uri);

    if (!this.props.hasSignature || !uriObj.isChannel) {
      return <span className="empty">Anonymous</span>;
    }

    const channelUriObj = Object.assign({}, uriObj);
    delete channelUriObj.path;
    const channelUri = uri.buildLbryUri(channelUriObj, false);

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