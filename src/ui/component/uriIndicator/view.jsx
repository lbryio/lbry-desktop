// @flow
import React from 'react';
import ClaimLink from 'component/claimLink';
import { buildURI } from 'lbry-redux';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?StreamClaim,
  channelClaim: ?ChannelClaim,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: string => void,
  uri: string,
};

class UriIndicator extends React.PureComponent<Props> {
  componentDidMount() {
    const { isResolvingUri, resolveUri, uri, claim } = this.props;
    if (!isResolvingUri && !claim && uri) {
      resolveUri(uri);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && !claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { link, isResolvingUri, claim } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    if (!claim.signing_channel) {
      return <span className="channel-name">Anonymous</span>;
    }

    const { name, claim_id: claimId } = claim.signing_channel;
    let claimLink;
    if (claim.is_channel_signature_valid) {
      claimLink = link ? buildURI({ channelName: name, claimId }) : false;
    }

    const inner = <span className="channel-name">{name}</span>;

    if (!claimLink) {
      return inner;
    }

    return <ClaimLink uri={claimLink}>{inner}</ClaimLink>;
  }
}

export default UriIndicator;
