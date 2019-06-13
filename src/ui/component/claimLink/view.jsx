// @flow
import uniqid from 'uniqid';
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import PreviewLink from 'component/previewLink';
import ChannelTooltip from 'component/common/channel-tooltip';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  thumbnail: ?string,
  autoEmbed: ?boolean,
  description: ?string,
  currentTheme: ?string,
  isResolvingUri: boolean,
  resolveUri: string => void,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
};

type State = {
  isTooltipActive: boolean,
};

class ClaimLink extends React.Component<Props, State> {
  parentId: string;

  static defaultProps = {
    href: null,
    title: null,
    thumbnail: null,
    autoEmbed: false,
    description: null,
    isResolvingUri: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = { isTooltipActive: false };

    // The tooltip component don't work very well with refs,
    // so we need to use an unique id for each link:
    // (this: any).buttonRef = React.createRef();
    (this: any).parentId = uniqid.time('claim-link-');
  }

  showTooltip = () => {
    this.setState({ isTooltipActive: true });
  };

  hideTooltip = () => {
    this.setState({ isTooltipActive: false });
  };

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

  componentDidMount() {
    const { isResolvingUri, resolveUri, uri, claim } = this.props;
    if (!isResolvingUri && !claim) {
      resolveUri(uri);
    }
  }

  componentDidUpdate() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && !claim) {
      resolveUri(uri);
    }
  }

  render() {
    const { uri, claim, title, description, thumbnail, currentTheme, autoEmbed, children, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span>{children}</span>;
    }

    const { isChannel, path } = parseURI(uri);
    const { claim_id: claimId, name: claimName } = claim;
    const showPreview = autoEmbed === true && !isUnresolved;
    const renderChannelTooltip = isChannel && !path;

    return (
      <React.Fragment>
        <Button
          id={this.parentId}
          label={children}
          title={title || claimName}
          button={'link'}
          navigate={uri}
          className="button--uri-indicator"
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
        />
        {showPreview && <PreviewLink uri={uri} />}
        {renderChannelTooltip && (
          <ChannelTooltip
            uri={uri}
            title={title}
            claimId={claimId}
            channelName={claimName}
            currentTheme={currentTheme}
            thumbnail={thumbnail}
            description={description}
            active={this.state.isTooltipActive}
            parent={`#${this.parentId}`}
            group={'channel-tooltip'}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ClaimLink;
