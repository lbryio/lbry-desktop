// @flow
import React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbryURI';
import classnames from 'classnames';
// import Icon from 'component/common/icon';

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
      return <span className="channel-name">Anonymous</span>;
    }

    let channelLink;
    if (signatureIsValid) {
      channelLink = link ? buildURI({ channelName, claimId: channelClaimId }, false) : false;
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
      </span>
    );

    if (!channelLink) {
      return inner;
    }

    return (
      <Button
        noPadding
        className="btn--uri-indicator"
        navigate="/show"
        navigateParams={{ uri: channelLink }}
      >
        {inner}
      </Button>
    );
  }
}

export default UriIndicator;
