// @flow
import React from 'react';
import Button from 'component/button';
import { buildURI } from 'lbry-redux';

type Props = {
  isResolvingUri: boolean,
  channelUri: ?string,
  link: ?boolean,
  claim: ?Claim,
  // Lint thinks we aren't using these, even though we are.
  // Possibly because the resolve function is an arrow function that is passed in props?
  resolveUri: string => void,
  uri: string,
};

class UriIndicator extends React.PureComponent<Props> {
  componentDidMount() {
    this.resolve(this.props);
  }

  componentDidUpdate() {
    this.resolve(this.props);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { link, isResolvingUri, claim } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    const isChannelClaim = claim.value_type === 'channel';

    if (!claim.signing_channel && !isChannelClaim) {
      return <span className="channel-name">Anonymous</span>;
    }

    const channelClaim = isChannelClaim ? claim : claim.signing_channel;

    if (channelClaim) {
      const { name, claim_id: claimId } = channelClaim;
      let channelLink;
      if (claim.is_channel_signature_valid) {
        channelLink = link ? buildURI({ channelName: name, claimId }) : false;
      }

      const inner = <span className="channel-name">{name}</span>;

      if (!channelLink) {
        return inner;
      }

      return (
        <Button className="button--uri-indicator" navigate={channelLink}>
          {inner}
        </Button>
      );
    } else {
      return null;
    }
  }
}

export default UriIndicator;
