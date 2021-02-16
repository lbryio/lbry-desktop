// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import LbcSymbol from 'component/common/lbc-symbol';
import Tooltip from 'component/common/tooltip';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  channelClaim: ChannelClaim,
  large?: boolean,
};

function getChannelLevel(amount: number): number {
  let level = 1;

  switch (true) {
    case amount >= 10 && amount < 1000:
      level = 2;
      break;
    case amount >= 1000 && amount < 10000:
      level = 3;
      break;
    case amount >= 10000 && amount < 500000:
      level = 4;
      break;
    case amount > 500000:
      level = 5;
      break;
  }

  return level;
}

function getChannelIcon(level: number): string {
  const icons = {
    '1': ICONS.CHANNEL_LEVEL_1,
    '2': ICONS.CHANNEL_LEVEL_2,
    '3': ICONS.CHANNEL_LEVEL_3,
    '4': ICONS.CHANNEL_LEVEL_4,
    '5': ICONS.CHANNEL_LEVEL_5,
  };

  return icons[level] || ICONS.CHANNEL_LEVEL_1;
}

function ChannelStakedIndicator(props: Props) {
  const { channelClaim, large = false } = props;

  if (!channelClaim || !channelClaim.meta) {
    return null;
  }

  const amount = parseFloat(channelClaim.amount) + parseFloat(channelClaim.meta.support_amount) || 0;
  const isControlling = channelClaim && channelClaim.meta.is_controlling;
  const level = getChannelLevel(amount);
  const icon = getChannelIcon(level);

  return (
    <Tooltip
      label={
        <div className="channel-staked__tooltip">
          <div className="channel-staked__tooltip-icons">
            <LevelIcon icon={icon} isControlling={isControlling} size={isControlling ? 14 : 10} />
          </div>

          <div className="channel-staked__tooltip-text">
            <span>{__('Level %current_level%', { current_level: level })}</span>
            <div className="channel-staked__amount">
              <LbcSymbol postfix={<CreditAmount amount={amount} showLBC={false} />} size={14} />
            </div>
          </div>
        </div>
      }
    >
      <div
        className={classnames('channel-staked__wrapper', {
          'channel-staked__wrapper--large': large,
        })}
      >
        <LevelIcon icon={icon} large={large} isControlling={isControlling} />
      </div>
    </Tooltip>
  );
}

type LevelIconProps = {
  isControlling: boolean,
  icon: string,
  large?: boolean,
};

function LevelIcon(props: LevelIconProps) {
  const { large, isControlling, icon } = props;
  return (
    icon && (
      <Icon
        icon={icon}
        size={large ? 36 : 14}
        className={classnames('channel-staked__indicator', {
          'channel-staked__indicator--large': large,
          'channel-staked__indicator--controlling': isControlling,
        })}
      />
    )
  );
}

export default ChannelStakedIndicator;
