// @flow
import React from 'react';
import Button from 'component/link';
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
      return <span>Anonymous</span>;
    }

    // I'll look at this when working on the file page
    // let icon;
    let channelLink;
    let modifier;

    if (signatureIsValid) {
      modifier = 'valid';
      channelLink = link ? buildURI({ channelName, claimId: channelClaimId }, false) : false;
    } else {
      // icon = 'icon-times-circle';
      // modifier = 'invalid';
    }

    // {!signatureIsValid ? (
    //   <Icon
    //   icon={icon}
    //   className={`channel-indicator__icon channel-indicator__icon--${modifier}`}
    //   />
    // ) : (
    //   ''
    // )}
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
      <Button navigate="/show" navigateParams={{ uri: channelLink }} noStyle>
        {inner}
      </Button>
    );
  }
}

export default UriIndicator;
