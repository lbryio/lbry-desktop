import React from 'react';
import lbry from 'lbry';
import lbryuri from 'lbryuri';
import {Icon} from 'component/common';

const UriIndicator = (props) => {
  const {
    uri,
    claim: {
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
    } = {},
  } = props

  const uriObj = lbryuri.parse(uri);

  if (!hasSignature || !uriObj.isChannel) {
    return <span className="empty">Anonymous</span>;
  }

  const channelUriObj = Object.assign({}, uriObj);
  delete channelUriObj.path;
  delete channelUriObj.contentName;
  const channelUri = lbryuri.build(channelUriObj, false);

  let icon, modifier;
  if (signatureIsValid) {
    modifier = 'valid';
  } else {
    icon = 'icon-times-circle';
    modifier = 'invalid';
  }

  return (
    <span>
      {channelUri} {' '}
      { !signatureIsValid ?
        <Icon icon={icon} className={`channel-indicator__icon channel-indicator__icon--${modifier}`} /> :
        '' }
    </span>
  )
}

export default UriIndicator;