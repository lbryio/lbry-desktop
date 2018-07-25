// @flow
import React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';
import classnames from 'classnames';
import type { Claim } from 'types/claim';

type Props = {
  isResolvingUri: boolean,
  claim: Claim,
  link: ?boolean,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  /* eslint-disable react/no-unused-prop-types */
  resolveUri: string => void,
  uri: string,
  /* eslint-enable react/no-unused-prop-types */
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
      channelLink = link ? buildURI({ channelName, claimId: channelClaimId }) : false;
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
        navigateParams={{ uri: channelLink, page: 1 }}
      >
        {inner}
      </Button>
    );
  }
}

export default UriIndicator;
