// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { icons } from './icon-custom';

// It would be nice to standardize this somehow
// These are copied from `scss/vars`, can they both come from the same source?
const RED_COLOR = '#e2495e';
const GREEN_COLOR = '#44b098';
const BLUE_COLOR = '#49b2e2';

type Props = {
  icon: string,
  tooltip?: boolean,
  customTooltipText?: string,
  iconColor?: string,
  size?: number,
  className?: string,
  sectionIcon?: boolean,
};

class IconComponent extends React.PureComponent<Props> {
  getTooltip = (icon: string) => {
    switch (icon) {
      case ICONS.REWARDS:
        return __('Featured content. Earn rewards for watching.');
      case ICONS.DOWNLOAD:
        return __('This file is in your library.');
      case ICONS.SUBSCRIBE:
        return __('You are subscribed to this channel.');
      case ICONS.SETTINGS:
        return __('Your settings.');
      default:
        return null;
    }
  };

  getIconColor = (color: string) => {
    switch (color) {
      case 'red':
        return RED_COLOR;
      case 'green':
        return GREEN_COLOR;
      case 'blue':
        return BLUE_COLOR;
      default:
        return color;
    }
  };

  render() {
    const { icon, tooltip, customTooltipText, iconColor, size, className, sectionIcon = false, ...rest } = this.props;
    const Icon = icons[this.props.icon];

    if (!Icon) {
      return null;
    }

    let color;
    if (iconColor) {
      color = this.getIconColor(iconColor);
    }

    let tooltipText;
    if (tooltip) {
      tooltipText = customTooltipText || this.getTooltip(icon);
    }

    const component = (
      <Icon
        title={tooltipText}
        size={size || (sectionIcon ? 20 : 16)}
        className={classnames(`icon icon--${icon}`, className, { 'color-override': iconColor })}
        color={color}
        {...rest}
      />
    );

    return sectionIcon ? <span className={`icon__wrapper icon__wrapper--${icon}`}>{component}</span> : component;
  }
}

export default IconComponent;
