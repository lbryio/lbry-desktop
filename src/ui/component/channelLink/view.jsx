// @flow
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import ChannelTooltip from 'component/common/channel-tooltip';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  thumbnail: ?string,
  description: ?string,
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

class ChannelLink extends React.Component<Props, State> {
  buttonRef: { current: ?any };

  static defaultProps = {
    href: null,
    title: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = { isTooltipActive: false };
    (this: any).buttonRef = React.createRef();
  }

  showTooltip = () => {
    if (this.isTooltipReady()) {
      setTimeout(() => this.setState({ isTooltipActive: true }), 500);
    }
  };

  hideTooltip = () => {
    if (this.isTooltipReady()) {
      setTimeout(() => this.setState({ isTooltipActive: false }), 500);
    }
  };

  isTooltipReady() {
    const { claim, isResolvingUri } = this.props;
    const blackListed = this.isClaimBlackListed();
    const isReady = !blackListed && !isResolvingUri && claim !== null;
    return isReady && this.buttonRef.current !== null;
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

  componentDidMount() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && !claim) {
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
    const { uri, claim, title, description, thumbnail, children, isResolvingUri } = this.props;
    const { channelName, claimName, claimId } = parseURI(uri);
    const tooltipReady = this.isTooltipReady();
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span className="channel-name">{children}</span>;
    }

    return (
      <React.Fragment>
        <Button
          className="button--uri-indicator"
          label={children}
          navigate={uri}
          innerRef={this.buttonRef}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
        />
        {tooltipReady && (
          <ChannelTooltip
            uri={uri}
            title={title}
            claimId={claimId}
            claimName={claimName}
            channelName={channelName}
            thumbnail={thumbnail}
            description={description}
            active={this.state.isTooltipActive}
            parent={this.buttonRef.current}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ChannelLink;
