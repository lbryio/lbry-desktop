// @flow
import * as React from 'react';
import Button from 'component/button';
import PreviewLink from 'component/previewLink';
import ChannelTooltip from 'component/channelTooltip';
import { parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  link?: boolean,
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

    if (claim && blackListedOutpoints) {
      let blackListed = false;

      for (let i = 0; i < blackListedOutpoints.length; i += 1) {
        const outpoint = blackListedOutpoints[i];
        if (outpoint.txid === claim.txid && outpoint.nout === claim.nout) {
          blackListed = true;
          break;
        }
      }
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
    const { uri, link, claim, title, className, autoEmbed, children, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { name: claimName } = claim;
    const { isChannel, path } = parseURI(uri);
    const isChannelClaim = isChannel && !path;
    const showPreview = autoEmbed === true && !isUnresolved;

    const innerContent = (
      <Button
        label={children}
        title={!isChannelClaim ? title || claimName : undefined}
        button={link ? 'link' : undefined}
        className={className}
        navigate={uri}
      />
    );

    const wrappedLink = (
      <ChannelTooltip uri={uri}>
        <span>{innerContent}</span>
      </ChannelTooltip>
    );

    return (
      <React.Fragment>
        {isChannelClaim ? wrappedLink : innerContent}
        {showPreview && <PreviewLink uri={uri} />}
      </React.Fragment>
    );
  }
}

export default ClaimLink;
