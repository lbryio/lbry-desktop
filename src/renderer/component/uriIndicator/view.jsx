import React from 'react';
import Icon from 'component/icon';
import Link from 'component/link';
import { buildURI } from 'lbryURI';
import classnames from 'classnames';

class UriIndicator extends React.PureComponent {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps);
  }

  resolve(props) {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    const { claim, link, uri, isResolvingUri, smallCard, span } = this.props;

    if (isResolvingUri && !claim) {
      return <span className="empty">Validating...</span>;
    }

    if (!claim) {
      return <span className="empty">Unused</span>;
    }

    const {
      channel_name: channelName,
      has_signature: hasSignature,
      signature_is_valid: signatureIsValid,
      value,
    } = claim;
    const channelClaimId =
      value && value.publisherSignature && value.publisherSignature.certificateId;

    if (!hasSignature || !channelName) {
      return <span className="empty">Anonymous</span>;
    }

    let icon, channelLink, modifier;

    if (signatureIsValid) {
      modifier = 'valid';
      channelLink = link ? buildURI({ channelName, claimId: channelClaimId }, false) : false;
    } else {
      icon = 'icon-times-circle';
      modifier = 'invalid';
    }

    const inner = (
      <span>
        <span
          className={classnames('channel-name', {
            'channel-name--small': smallCard,
            'button-text no-underline': link,
          })}
        >
          {channelName}
        </span>{' '}
        {!signatureIsValid ? (
          <Icon
            icon={icon}
            className={`channel-indicator__icon channel-indicator__icon--${modifier}`}
          />
        ) : (
          ''
        )}
      </span>
    );

    if (!channelLink) {
      return inner;
    }

    return (
      <Link
        navigate="/show"
        navigateParams={{ uri: channelLink }}
        className="no-underline"
        span={span}
      >
        {inner}
      </Link>
    );
  }
}

export default UriIndicator;
