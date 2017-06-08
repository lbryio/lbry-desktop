import React from "react";

export class ToolTip extends React.PureComponent {
  static propTypes = {
    body: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
    };
  }

  handleClick() {
    this.setState({
      showTooltip: !this.state.showTooltip,
    });
  }

  handleTooltipMouseOut() {
    this.setState({
      showTooltip: false,
    });
  }

  render() {
    return (
      <span className={"tooltip " + (this.props.className || "")}>
        <a
          className="tooltip__link"
          onClick={() => {
            this.handleClick();
          }}
        >
          {this.props.label}
        </a>
        <div
          className={
            "tooltip__body " + (this.state.showTooltip ? "" : " hidden")
          }
          onMouseOut={() => {
            this.handleTooltipMouseOut();
          }}
        >
          {this.props.body}
        </div>
      </span>
    );
  }
}

export default ToolTip;
