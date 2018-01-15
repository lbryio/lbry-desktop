// @flow
import React from 'react';
import classnames from 'classnames';
import * as icons from 'constants/icons';

type Props = {
  icon: string,
  fixed?: boolean,
  padded?: boolean,
};

class Icon extends React.PureComponent<Props> {
  getIconTitle() {
    const { icon } = this.props;

    switch (icon) {
      case icons.FEATURED:
        return __('Watch this and earn rewards.');
      case icons.LOCAL:
        return __('You have a copy of this file.');
      default:
        return '';
    }
  }

  render() {
    const { icon, fixed, padded } = this.props;
    const iconClassName = icon.startsWith('icon-') ? icon : `icon-${icon}`;
    const title = this.getIconTitle();

    const spanClassName = classnames(
      {
        'icon--fixed-width': fixed,
        'icon--padded': padded,
      },
      iconClassName
    );

    return <span className={spanClassName} title={title} />;
  }
}

export default Icon;
