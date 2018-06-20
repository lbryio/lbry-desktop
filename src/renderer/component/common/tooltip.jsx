// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  body: string,
  label?: string,
  children?: React.Node,
  icon?: boolean,
  direction: string,
  onComponent?: boolean, // extra padding to account for button/form field size
};

class ToolTip extends React.PureComponent<Props> {
  static defaultProps = {
    direction: 'bottom',
  };

  render() {
    const { children, label, body, icon, direction, onComponent } = this.props;

    const tooltipContent = children || label;
    const bodyLength = body.length;
    const isShortDescription = bodyLength < 30;

    return (
      <span
        className={classnames('tooltip', {
          'tooltip--label': label && !icon,
          'tooltip--icon': icon,
          'tooltip--top': direction === 'top',
          'tooltip--right': direction === 'right',
          'tooltip--bottom': direction === 'bottom',
          'tooltip--left': direction === 'left',
          'tooltip--on-component': onComponent,
        })}
      >
        {tooltipContent}
        <span
          className={classnames('tooltip__body', {
            'tooltip__body--short': isShortDescription,
          })}
        >
          {body}
        </span>
      </span>
    );
  }
}

export default ToolTip;
