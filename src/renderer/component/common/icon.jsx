// @flow
import React from 'react';
import * as FeatherIcons from 'react-feather';
import * as icons from 'constants/icons';

const RED_COLOR = '#e2495e';
const PURPLE_COLOR = '#8165b0';

type Props = {
  icon: string,
};

class IconComponent extends React.PureComponent<Props> {
  // TODO: Move all icons to constants and add titles for all
  // Add some some sort of hover flyout with the title?

  render() {
    const { icon } = this.props;
    const Icon = FeatherIcons[icon];

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

    return Icon ? <Icon size={size} className="icon" color={color} /> : null;
  }
}

export default IconComponent;
