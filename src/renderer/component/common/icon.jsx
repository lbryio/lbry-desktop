// @flow
import React from 'react';
// import * as icons from 'constants/icons';
import * as FeatherIcons from 'react-feather';
import * as icons from 'constants/icons';

const RED_COLOR = '#e2495e';

type Props = {
  icon: string,
  size?: number,
};

class IconComponent extends React.PureComponent<Props> {
  // TODO: Move all icons to constants and add titles for all
  // Add some some sort of hover flyout with the title?

  render() {
    const { icon, size = 14 } = this.props;
    const Icon = FeatherIcons[icon];
    let color;
    if (icon === icons.HEART) {
      color = RED_COLOR;
    }
    return Icon ? <Icon size={size} className="icon" color={color} /> : null;
  }
}

export default IconComponent;
