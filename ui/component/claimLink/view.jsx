// @flow
import * as React from 'react';
import Button from 'component/button';
import PreviewLink from 'component/previewLink';
import UriIndicator from 'component/uriIndicator';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  className: ?string,
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
    title: null,
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
    const { uri, claim, title, className, autoEmbed, children, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { name: claimName, value_type: valueType } = claim;
    const isChannel = valueType === 'channel';
    const showPreview = autoEmbed === true && !isUnresolved;

     if(isChannel){
       return <UriIndicator uri={uri} link addTooltip />
     }

    return (
      <React.Fragment>
        <Button label={children} title={title || claimName} button={'link'} navigate={uri} className={className} />
        {showPreview && <PreviewLink uri={uri} />}
      </React.Fragment>
    );
  }
}

export default ClaimLink;
