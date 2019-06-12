// @flow
import * as React from 'react';
import Button from 'component/button';
import ChannelTooltip from 'component/common/channel-tooltip';
import uniqid from 'uniqid';

type Props = {
  uri: string,
  title: ?string,
  claim: StreamClaim,
  children: React.Node,
  thumbnail: ?string,
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

class ChannelLink extends React.Component<Props, State> {
  parentId: string;
  buttonRef: { current: ?any };

  static defaultProps = {
    href: null,
    title: null,
  };

  constructor(props: Props) {
    super(props);
    this.state = { isTooltipActive: false };

    // The tooltip component don't work very well with refs,
    // so we need to use an unique id for each link:
    // (this: any).buttonRef = React.createRef();
    (this: any).parentId = uniqid.time('channnel-');
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
    const { uri, claim, title, description, thumbnail, children, currentTheme, isResolvingUri } = this.props;
    const isUnresolved = (!isResolvingUri && !claim) || !claim;
    const isBlacklisted = this.isClaimBlackListed();

    if (isBlacklisted || isUnresolved) {
      return <span className="channel-name">{children}</span>;
    }

    const { claim_id: claimId, name: channelName } = claim;

    return (
      <React.Fragment>
        <Button
          id={this.parentId}
          className="button--uri-indicator"
          label={children}
          navigate={uri}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
        />
        <ChannelTooltip
          uri={uri}
          title={title}
          claimId={claimId}
          channelName={channelName}
          currentTheme={currentTheme}
          thumbnail={thumbnail}
          description={description}
          active={this.state.isTooltipActive}
          parent={`#${this.parentId}`}
          group={'channel-tooltip'}
        />
      </React.Fragment>
    );
  }
}

export default ChannelLink;
