// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Tooltip from 'component/common/tooltip';
import classnames from 'classnames';
import { customIcons } from './icon-custom';

let featherIcons = false;
const featherIconsPromise = import(/* webpackChunkName: "react-feather" */
/* webpackPrefetch: true */
'react-feather').then(result => (featherIcons = result));

const LazyFeatherIcons = new Proxy(
  {},
  {
    get(target, name) {
      if (featherIcons) {
        return featherIcons[name];
      }

      return React.lazy(() =>
        featherIconsPromise.then(featherIcons => ({ default: featherIcons[name] }))
      );
    },
  }
);

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
  className?: string,
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
    const { icon, tooltip, iconColor, size, className } = this.props;
    const Icon = customIcons[this.props.icon] || LazyFeatherIcons[this.props.icon];

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
    const inner = (
      <React.Suspense
        fallback={
          <svg
            height={iconSize}
            width={iconSize}
            className={classnames('icon', className)}
            color={color}
          />
        }
      >
        <Icon size={iconSize} className={classnames('icon', className)} color={color} />
      </React.Suspense>
    );

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
