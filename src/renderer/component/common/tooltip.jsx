// @flow
import * as React from 'react';
import classnames from 'classnames';

type Props = {
  body: string,
  label?: string,
  children: ?React.Node,
  icon: ?boolean,
  direction: string,
  onFormField?: boolean,
};

class ToolTip extends React.PureComponent<Props> {
  static defaultProps = {
    direction: 'bottom',
  };

  render() {
    const { children, label, body, icon, direction, onFormField } = this.props;

    const tooltipContent = children || label;

    return (
      <span
        className={classnames('tooltip', {
          'tooltip--label': label && !icon,
          'tooltip--icon': icon,
          'tooltip--top': direction === 'top',
          'tooltip--right': direction === 'right',
          'tooltip--bottom': direction === 'bottom',
          'tooltip--left': direction === 'left',
          'tooltip--on-formfield': onFormField,
        })}
      >
        {tooltipContent}
        <span className="tooltip__body">{body}</span>
      </span>
    );
  }
}

export default ToolTip;
