// @flow
import React from 'react';
// import * as icons from 'constants/icons';
import * as FeatherIcons from 'react-feather';
import * as icons from 'constants/icons';

const RED_COLOR = '#e2495e';

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
    if (icon === icons.HEART || icon === icons.FEATURED) {
      color = RED_COLOR;
    }

    let size = 14;
    if (icon === icons.ARROW_LEFT || icon === icons.ARROW_RIGHT) {
      size = 20;
    }

    return Icon ? <Icon size={size} className="icon" color={color} /> : null;
  }
}

export default IconComponent;
