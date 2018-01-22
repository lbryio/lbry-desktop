import React from 'react';
import Icon from 'component/icon';
import Link from 'component/link';
import { Lbryuri } from 'lbry-redux';
import classnames from 'classnames';

class UriIndicator extends React.PureComponent {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.resolve(nextProps);
  }

  // eslint-disable-next-line class-methods-use-this
  resolve(props) {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  }

  render() {
    // eslint-disable-next-line react/prop-types, no-unused-vars
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

    let icon;
    let channelLink;
    let modifier;

    if (signatureIsValid) {
      modifier = 'valid';
      channelLink = link ? Lbryuri.build({ channelName, claimId: channelClaimId }, false) : false;
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

    /* eslint-disable jsx-a11y/anchor-is-valid */
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
