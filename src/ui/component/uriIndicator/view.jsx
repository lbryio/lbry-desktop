// @flow
import React from 'react';
import Button from 'component/button';
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
    const { link, isResolvingUri, claim } = this.props;

    if (!claim) {
      return <span className="empty">{isResolvingUri ? 'Validating...' : 'Unused'}</span>;
    }

    if (!claim.signing_channel) {
      return <span className="channel-name">Anonymous</span>;
    }

    const { name, claim_id: claimId } = claim.signing_channel;
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
  }
}

export default UriIndicator;
