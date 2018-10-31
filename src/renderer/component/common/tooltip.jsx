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

type State = {
  direction: string,
};

class ToolTip extends React.PureComponent<Props, State> {
  static defaultProps = {
    direction: 'bottom',
  };

  constructor(props) {
    super(props);
    this.tooltip = React.createRef();
    this.state = {
      direction: this.props.direction,
    };
  }

  componentDidMount() {
    this.handleVisibility();
  }

  getVisibility = () => {
    const node = this.tooltip.current;
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
    if (!visibility[direction]) {
      this.invertDirection();
    }
  };

  render() {
    const { direction } = this.state;
    const { children, label, body, icon, onComponent } = this.props;

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
        })}
      >
        {tooltipContent}
        <span
          ref={this.tooltip}
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
