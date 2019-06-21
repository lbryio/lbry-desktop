// @flow
import * as React from 'react';
import classnames from 'classnames';
import ChannelThumbnail from 'component/channelThumbnail';
import TruncatedText from 'component/common/truncated-text';

// Tooltip components
import Portal from '@reach/portal';
import getPostion from './position.js';
import { useTooltip, TooltipPopup } from '@reach/tooltip';

// Tooltip base styles
import '@reach/tooltip/styles.css';

const ARROW_SIZE = 10;

type ChannelTooltipProps = {
  uri: string,
  claim: ?Claim,
  title: ?string,
  children: any,
  resolveUri: string => void,
  description: ?string,
  isResolvingUri: boolean,
};

type LabelProps = {
  uri: string,
  title: ?string,
  claimId: string,
  channelName: string,
  description: ?string,
};

type TriangleTooltipProps = {
  label: any,
  children: any,
  ariaLabel: ?string,
};

function TriangleTooltip(props: TriangleTooltipProps) {
  const { label, children, ariaLabel } = props;

  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();

  // Tooltip direction
  const [direction, setDirection] = React.useState('bottom');

  // destructure off what we need to position the triangle
  const { isVisible, triggerRect } = tooltip;

  let arrowTop;

  // Top
  if (direction === 'top') {
    arrowTop = triggerRect && triggerRect.bottom - (triggerRect.height + ARROW_SIZE) + window.scrollY;
  }

  // Bottom
  if (direction === 'bottom') {
    arrowTop = triggerRect && triggerRect.bottom + window.scrollY;
  }

  return (
    <React.Fragment>
      {React.cloneElement(children, trigger)}
      {isVisible && (
        // The Triangle. We position it relative to the trigger, not the popup
        // so that collisions don't have a triangle pointing off to nowhere.
        // Using a Portal may seem a little extreme, but we can keep the
        // positioning logic simpler here instead of needing to consider
        // the popup's position relative to the trigger and collisions
        <Portal>
          <span
            className={classnames('channel-tooltip__arrow', `channel-tooltip__arrow--${direction}`)}
            style={{
              position: 'absolute',
              top: arrowTop,
              left: triggerRect && triggerRect.left - ARROW_SIZE + triggerRect.width / 2,
            }}
          />
        </Portal>
      )}
      <TooltipPopup
        {...tooltip}
        label={label}
        ariaLabel={ariaLabel}
        className={'channel-tooltip'}
        position={(triggerRect, tooltipRect) => getPostion(triggerRect, tooltipRect, direction, setDirection)}
      />
    </React.Fragment>
  );
}

const ChannelTooltipLabel = (props: LabelProps) => {
  const { uri, title, claimId, description, channelName } = props;
  const channelUrl = `${channelName}#${claimId}`;
  const formatedName = channelName.replace('@', '');

  return (
    <div className={'channel-tooltip__content'}>
      <div className={'channel-tooltip__profile'}>
        <ChannelThumbnail uri={uri} />
        <div className={'channel-tooltip__info'}>
          <h2 className={'channel-tooltip__title'}>
            <TruncatedText lines={1}>{title || formatedName}</TruncatedText>
          </h2>
          <h3 className={'channel-tooltip__url'}>
            <TruncatedText lines={1}>{channelUrl}</TruncatedText>
          </h3>
        </div>
      </div>
      {description && (
        <div className={'channel-tooltip__description'}>
          <div>
            <TruncatedText lines={2}>{description}</TruncatedText>
          </div>
        </div>
      )}
      <div className={'channel-tooltip__stats'} />
    </div>
  );
};

class ChannelTooltip extends React.Component<ChannelTooltipProps> {
  componentDidMount() {
    this.resolve(this.props);
  }

  componentDidUpdate() {
    this.resolve(this.props);
  }

  resolve = (props: ChannelTooltipProps) => {
    const { isResolvingUri, resolveUri, claim, uri } = props;

    if (!isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const { uri, claim, children, title, description } = this.props;

    if (!uri || !claim) {
      return children;
    }

    const { claim_id: claimId, name: channelName } = claim;

    // Generate aria-label
    const ariaLabel = title || channelName;

    const label = (
      <ChannelTooltipLabel
        uri={uri}
        title={title}
        claimId={claimId}
        channelName={channelName}
        description={description}
      />
    );

    return (
      <TriangleTooltip label={label} ariaLabel={ariaLabel}>
        {children}
      </TriangleTooltip>
    );
  }
}

export default ChannelTooltip;
