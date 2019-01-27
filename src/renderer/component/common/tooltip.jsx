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

  componentDidMount() {
    this.handleVisibility();
  }

  getVisibility = () => {
    if (!this.tooltip) {
      return;
    }

    const node = this.tooltip;
    const rect = node.getBoundingClientRect();

    // Get parent-container
    const viewport = document.getElementById('content');
    if (!viewport) {
      throw Error('Document must contain parent div with #content');
    }

    const visibility = {
      top: rect.top >= 0,
      left: rect.left >= 0,
      right: rect.right <= viewport.offsetWidth,
      bottom: rect.bottom <= viewport.offsetHeight,
    };

    return visibility;
  };

  invertDirection = () => {
    // Get current direction
    const { direction } = this.state;
    // Inverted directions
    const directions = {
      top: 'bottom',
      left: 'right',
      right: 'left',
      bottom: 'top',
    };

    const inverted = directions[direction];

    // Update direction
    if (inverted) {
      this.setState({ direction: inverted });
    }
  };

  handleVisibility = () => {
    const { direction } = this.state;
    const visibility = this.getVisibility();

    // Invert direction if tooltip is outside viewport bounds
    if (!visibility || !visibility[direction]) {
      this.invertDirection();
    }
  };

  tooltip: ?HTMLSpanElement;

  render() {
    const { direction } = this.state;
    const { children, label, body, icon, onComponent, alwaysVisible } = this.props;

    const tooltipContent = children || label;
    const bodyLength = body.length;
    const isShortDescription = bodyLength < 30;

    return (
      <span
        onFocus={this.handleVisibility}
        onMouseOver={this.handleVisibility}
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
          className={classnames('card tooltip__body', {
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
