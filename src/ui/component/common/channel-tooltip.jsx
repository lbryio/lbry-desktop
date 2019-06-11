// @flow
import * as React from 'react';
import ToolTip from 'react-portal-tooltip';
import TruncatedText from 'component/common/truncated-text';
import ChannelThumbnail from 'component/common/channelThumbnail';

type TooltipProps = {
  uri: string,
  title: ?string,
  active: ?boolean,
  parent: ?HTMLElement,
  claimId: ?string,
  thumbnail: ?string,
  claimName: ?string,
  channelName: ?string,
  description: ?string,
};

const ChannelTooltip = (props: TooltipProps) => {
  const { uri, title, active, parent, claimId, thumbnail, claimName, channelName, description } = props;

  const bgColor = '#32373b';

  const style = {
    style: { background: bgColor },
    arrowStyle: { color: bgColor },
  };

  return (
    <ToolTip
      align="left"
      arrow="left"
      group="channel-tooltip"
      active={active}
      style={style}
      parent={parent}
      position="bottom"
      tooltipTimeout={0}
    >
      <div className={'channel-tooltip'}>
        <div className={'media-tile media-tile--small card--link'}>
          <ChannelThumbnail uri={uri} thumbnail={thumbnail} />
          <div className={'channel-tooltip__info'}>
            <h2 className={'channel-tooltip__title'}>
              <TruncatedText lines={1}>{title || channelName}</TruncatedText>
            </h2>
            <h3 className={'channel-tooltip__url'}>
              <TruncatedText lines={1}>{claimName + (claimId ? `#${claimId}` : '')}</TruncatedText>
            </h3>
          </div>
        </div>
        {description && (
          <div className={'channel-tooltip__description'}>
            <p>
              <TruncatedText lines={2}>{description}</TruncatedText>
            </p>
          </div>
        )}
        <div className={'channel-tooltip__stats'} />
      </div>
    </ToolTip>
  );
};

export default ChannelTooltip;
