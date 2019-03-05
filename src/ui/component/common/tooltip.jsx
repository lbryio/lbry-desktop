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
  alwaysVisible?: boolean, // should tooltip stay open, guide callbacks will close it manually
};

type State = {
  direction: string,
};

class ToolTip extends React.PureComponent<Props, State> {
  static defaultProps = {
    direction: 'bottom',
    alwaysVisible: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      direction: this.props.direction,
    };
  }

  tooltip: ?HTMLSpanElement;

  render() {
    const { direction } = this.state;
    const { children, label, body, icon, onComponent, alwaysVisible } = this.props;

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
          'tooltip--always-visible': alwaysVisible,
        })}
      >
        {tooltipContent}
        <span
          ref={ref => {
            this.tooltip = ref;
          }}
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
