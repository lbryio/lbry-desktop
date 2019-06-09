// @flow
import * as React from 'react';
import ToolTip from 'react-portal-tooltip';

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
  const { title, active, parent, claimId, thumbnail, claimName, channelName, description } = props;

  const bgColor = '#32373b';

  const style = {
    style: { background: bgColor },
    arrowStyle: { color: bgColor },
  };

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

export default ChannelTooltip;
