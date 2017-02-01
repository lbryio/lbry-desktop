import React from 'react';

export let ToolTip = React.createClass({
  propTypes: {
    body: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      showTooltip: false,
    };
  },
  handleClick: function() {
    this.setState({
      showTooltip: !this.state.showTooltip,
    });
  },
  handleTooltipMouseOut: function() {
    this.setState({
      showTooltip: false,
    });
  },
  render: function() {
    return (
      <span className={'tooltip ' + (this.props.className || '')}>
        <a className="tooltip__link" onClick={this.handleClick}>
          {this.props.label}
        </a>
        <div className={'tooltip__body ' + (this.state.showTooltip ? '' : ' hidden')}
             onMouseOut={this.handleTooltipMouseOut}>
          {this.props.body}
        </div>
      </span>
    );
  }
});