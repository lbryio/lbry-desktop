// @flow
import { SIMPLE_SITE } from 'config';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import LbcSymbol from 'component/common/lbc-symbol';
import Tooltip from 'component/common/tooltip';
import CreditAmount from 'component/common/credit-amount';

type Props = {
  channelClaim: ChannelClaim,
  amount: number,
  level: number,
  large?: boolean,
  inline?: boolean,
  hideTooltip?: Boolean,
};

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

function getChannelIconB(level: number): string {
  const icons = {
    '1': ICONS.CHANNEL_LEVEL_1_B,
    '2': ICONS.CHANNEL_LEVEL_2_B,
    '3': ICONS.CHANNEL_LEVEL_3_B,
    '4': ICONS.CHANNEL_LEVEL_4_B,
    '5': ICONS.CHANNEL_LEVEL_5_B,
  };

  return icons[level] || ICONS.CHANNEL_LEVEL_1_B;
}

function ChannelStakedIndicator(props: Props) {
  const { channelClaim, amount, level, large = false, inline = false, hideTooltip = false } = props;

  if (!channelClaim || !channelClaim.meta) {
    return null;
  }

  const isControlling = channelClaim && channelClaim.meta.is_controlling;
  const icon = getChannelIcon(level);
  const icon_b = getChannelIconB(level);

  if (!hideTooltip) {
    return (
      SIMPLE_SITE && (
        <Tooltip
          title={
            <div className="channel-staked__tooltip">
              <div className="channel-staked__tooltip-icons">
                <LevelIcon icon={icon_b} isControlling={isControlling} size={isControlling ? 14 : 10} />
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
              'channel-staked__wrapper--inline': inline,
            })}
          >
            <LevelIcon icon={icon} large={large} isControlling={isControlling} />
          </div>
        </Tooltip>
      )
    );
  } else {
    return (
      SIMPLE_SITE && (
        <div
          className={classnames('channel-staked__wrapper', {
            'channel-staked__wrapper--large': large,
            'channel-staked__wrapper--inline': inline,
          })}
        >
          <LevelIcon icon={icon} large={large} isControlling={isControlling} />
        </div>
      )
    );
  }
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
