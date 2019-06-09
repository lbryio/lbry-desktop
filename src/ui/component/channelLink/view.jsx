// @flow
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import ChannelTooltip from 'component/common/channel-tooltip';

type Props = {
  uri: string,
  title: ?string,
  cover: ?string,
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
    const blackListed = this.isClaimBlackListed();
    const isReady = !blackListed && !isResolvingUri && claim !== null;
    const tooltipReady = this.buttonRef.current !== null;

    return (
      <React.Fragment>
        <Button
          button={'link'}
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
            active={isReady && this.state.isTooltipActive}
            parent={this.buttonRef.current}
          />
        )}
      </React.Fragment>
    );
  }
}

export default ChannelLink;
