// @flow
import * as React from 'react';
import ToolTip from 'react-portal-tooltip';
import TruncatedText from 'component/common/truncated-text';
import ChannelThumbnail from 'component/common/channelThumbnail';

type TooltipProps = {
  uri: string,
  title: ?string,
  group: ?string,
  active: ?boolean,
  parent: ?HTMLElement | ?string,
  claimId: string,
  thumbnail: ?string,
  channelName: string,
  description: ?string,
  currentTheme: ?string,
};

const ChannelTooltip = (props: TooltipProps) => {
  const { uri, group, title, active, parent, claimId, thumbnail, description, channelName, currentTheme } = props;

  let bgColor = 'var(--lbry-white)';

  if (currentTheme === 'dark') {
    // Background color of the tooltip component,
    // taken from the header component:
    // mix($lbry-black, $lbry-gray-3, 90%);
    bgColor = '#32373b';
  }

  const style = {
    style: { background: bgColor, padding: 0 },
    arrowStyle: { color: bgColor, borderColor: false },
  };

  const channelUrl = `${channelName}#${claimId}`;
  const formatedName = channelName.replace('@', '');

  return (
    <ToolTip
      align="left"
      arrow="left"
      active={parent && active}
      group={group}
      style={style}
      parent={parent}
      position="bottom"
    >
      <div className={'channel-tooltip'}>
        <div className={'channel-tooltip__profile'}>
          <ChannelThumbnail uri={uri} thumbnail={thumbnail} />
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

export default React.memo<TooltipProps>(ChannelTooltip);
