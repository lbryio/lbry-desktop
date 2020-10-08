// @flow
import * as React from 'react';
import PreviewLink from 'component/previewLink';
import UriIndicator from 'component/uriIndicator';

type Props = {
  uri: string,
  claim: StreamClaim,
  children: React.Node,
  autoEmbed: ?boolean,
  description: ?string,
  isResolvingUri: boolean,
  resolveUri: string => void,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

class ClaimLink extends React.Component<Props> {
  static defaultProps = {
    href: null,
    link: false,
    thumbnail: null,
    autoEmbed: false,
    description: null,
    isResolvingUri: false,
  };

  componentDidMount() {
    this.resolve(this.props);
  }

  componentDidUpdate() {
    this.resolve(this.props);
  }

  isClaimBlackListed() {
    const { claim, blackListedOutpoints } = this.props;
    const signingChannel = claim && claim.signing_channel;
    if (claim && blackListedOutpoints) {
      let blackListed = false;

      blackListed = blackListedOutpoints.some(
        outpoint =>
          (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
          (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
      );
      return blackListed;
    }
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { uri, claim, autoEmbed, children, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { value_type: valueType } = claim;
    const isChannel = valueType === 'channel';
    const showPreview = autoEmbed === true && !isUnresolved;

    if (isChannel) {
      return <UriIndicator uri={uri} link addTooltip />;
    }

    return <React.Fragment>{showPreview && <PreviewLink uri={uri} />}</React.Fragment>;
  }
}

export default ClaimLink;
