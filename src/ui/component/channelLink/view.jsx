// @flow
import * as React from 'react';
import { parseURI } from 'lbry-redux';
import ToolTip from 'react-portal-tooltip';
import Button from 'component/button';

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

type TooltipProps = {
  uri: string,
  style: Object,
  title: ?string,
  active: ?boolean,
  parent: ?HTMLElement,
  claimId: ?string,
  thumbnail: ?string,
  claimName: ?string,
  channelName: ?string,
  description: ?string,
};

type State = {
  isTooltipActive: boolean,
};

const ChannelTooltip = (props: TooltipProps) => {
  const { style, title, active, parent, claimId, thumbnail, claimName, channelName, description } = props;

  return (
    <ToolTip active={active} position="bottom" style={style} arrow="left" align="left" parent={parent}>
      <div className={'channel-tooltip'}>
        <div className={'channel-tooltip__info'}>
          <img className={'channel-tooltip__thumbnail'} src={thumbnail} />
          <div>
            <h2 className={'channel-tooltip__title'}>{title || channelName}</h2>
            <h3 className={'channel-tooltip__url'}>
              {claimName}
              {claimId && `#${claimId}`}
            </h3>
          </div>
        </div>
        <div className={'channel-tooltip__description'}>
          <p>{description}</p>
        </div>
        <div className={'channel-tooltip__stats'} />
      </div>
    </ToolTip>
  );
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
    const { isResolvingUri, resolveUri, uri } = this.props;
    if (!isResolvingUri) {
      resolveUri(uri);
    }
  }

  componentDidUpdate() {
    const { isResolvingUri, resolveUri, claim, uri } = this.props;
    if (!isResolvingUri && uri && claim === undefined) {
      resolveUri(uri);
    }
  }

  render() {
    const { uri, claim, title, description, thumbnail, children, isResolvingUri } = this.props;
    const { channelName, claimName, claimId } = parseURI(uri);
    const blackListed = this.isClaimBlackListed();
    const isReady = !blackListed && !isResolvingUri && claim !== null;
    const tooltipReady = isReady && this.buttonRef.current !== null;

    const bgColor = '#32373b';

    const tooltipStyle = {
      style: { background: bgColor },
      arrowStyle: { color: bgColor },
    };

    return isReady ? (
      <React.Fragment>
        <Button
          button="link"
          label={children}
          navigate={uri}
          innerRef={this.buttonRef}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
        />
        {tooltipReady && (
          <ChannelTooltip
            uri={uri}
            style={tooltipStyle}
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
    ) : (
      <span>{children}</span>
    );
  }
}

export default ChannelLink;
