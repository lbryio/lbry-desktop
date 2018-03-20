// @flow
import React from 'react';
// import * as icons from 'constants/icons';
import * as Icons from 'react-feather';

type Props = {
  icon: string,
  size?: number,
};

class IconComponent extends React.PureComponent<Props> {
  // TODO: Move all icons to constants and add titles for all
  // Add some some sort of hover flyout with the title?

  render() {
    const { icon, size = 14 } = this.props;
    const Icon = Icons[icon];
    let color;
    if (icon === 'Heart') {
      color = '#e2495e'
    }
    return Icon ? <Icon size={size} className="icon" color={color} /> : null;
  }
}

export default IconComponent;
