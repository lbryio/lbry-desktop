// @flow
import React from 'react';
import Button from 'component/link';
import { buildURI } from 'lbryURI';
import { Icon } from 'component/common';
import classnames from 'classnames';

type Props = {
  isResolvingUri: boolean,
  resolveUri: string => void,
  claim: {
    channel_name: string,
    has_signature: boolean,
    signature_is_valid: boolean,
    value: {
      publisherSignature: { certificateId: string },
    },
  },
  uri: string,
  link: ?boolean,
};

class UriIndicator extends React.PureComponent<Props> {
  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.resolve(nextProps);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { claim, link, isResolvingUri } = this.props;
    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
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
      return <span>Anonymous</span>;
    }

    let icon;
    let channelLink;
    let modifier;

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
      <Button navigate="/show" navigateParams={{ uri: channelLink }} fakeLink>
        {inner}
      </Button>
    );
  }
}

export default UriIndicator;
