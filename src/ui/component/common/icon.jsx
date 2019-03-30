// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import * as FeatherIcons from 'react-feather';
import Tooltip from 'component/common/tooltip';
import { customIcons } from './icon-custom';

// It would be nice to standardize this somehow
// These are copied from `scss/vars`, can they both come from the same source?
const RED_COLOR = '#e2495e';
const GREEN_COLOR = '#44b098';
const BLUE_COLOR = '#49b2e2';

type Props = {
  icon: string,
  tooltip?: string, // tooltip direction
  iconColor?: string,
  size?: number,
};

class IconComponent extends React.PureComponent<Props> {
  getTooltip = (icon: string) => {
    switch (icon) {
      case ICONS.FEATURED:
        return __('Featured content. Earn rewards for watching.');
      case ICONS.LOCAL:
        return __('This file is downloaded.');
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
        return undefined;
    }
  };

  render() {
    const { icon, tooltip, iconColor, size } = this.props;
    const Icon = customIcons[this.props.icon] || FeatherIcons[this.props.icon];
    console.log('icon', icon);
    console.log('Icon', Icon);
    if (!Icon) {
      return null;
    }

    let color;
    if (iconColor) {
      color = this.getIconColor(iconColor);
    }

    const iconSize = size || 14;

    let tooltipText;
    if (tooltip) {
      tooltipText = this.getTooltip(icon);
    }
    const inner = <Icon size={iconSize} className="icon" color={color} />;

    return tooltipText ? (
      <Tooltip icon body={tooltipText} direction={tooltip}>
        {inner}
      </Tooltip>
    ) : (
      inner
    );
  }
}

export default IconComponent;
