// @flow
import React from 'react';
import * as FeatherIcons from 'react-feather';
import * as icons from 'constants/icons';
import Tooltip from 'component/common/tooltip';

const RED_COLOR = '#e2495e';
const PURPLE_COLOR = '#8165b0';

type Props = {
  icon: string,
  tooltip: ?string, // tooltip direction
};

class IconComponent extends React.PureComponent<Props> {
  getTooltip = (icon: string) => {
    switch (icon) {
      case icons.FEATURED:
        return __('Featured content. Earn rewards for watching.');
      case icons.LOCAL:
        return __('This file is downloaded.');
      default:
        return null;
    }
  };
  render() {
    const { icon, tooltip } = this.props;
    const Icon = FeatherIcons[icon];

    if (!Icon) {
      return null;
    }

    let color;
    if (icon === icons.TRASH || icon === icons.FEATURED) {
      color = RED_COLOR;
    } else if (icon === icons.OPEN) {
      color = PURPLE_COLOR;
    }

    let size = 14;
    if (icon === icons.ARROW_LEFT || icon === icons.ARROW_RIGHT) {
      size = 20;
    }

    let tooltipText;
    if (tooltip) {
      tooltipText = this.getTooltip(icon);
    }
    const inner = <Icon size={size} className="icon" color={color} />;

    return tooltip ? (
      <Tooltip icon body={tooltipText} direction={tooltip}>
        {inner}
      </Tooltip>
    ) : (
      inner
    );
  }
}

export default IconComponent;
