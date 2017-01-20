import React from 'react';
import {Icon, ToolTip} from './common.js';

export let Link = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    button: React.PropTypes.string,
    badge: React.PropTypes.string,
    hidden: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      hidden: false,
      disabled: false,
    };
  },
  handleClick: function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  },
  render: function() {
    if (this.props.hidden) {
      return null;
    }

    /* The way the class name is generated here is a mess -- refactor */

    const className = (this.props.className || '') +
      (this.props.button ? ' button-block button-' + this.props.button : '') +
      (this.props.disabled ? ' disabled' : '');

    let content;
    if (this.props.children) { // Custom content
      content = this.props.children;
    } else {
      content = [
        'icon' in this.props ? <Icon icon={this.props.icon} fixed={true} /> : null,
         <span className="link-label">{this.props.label}</span>,
        'badge' in this.props ? <span className="badge">{this.props.badge}</span> : null,
      ];
    }

    return (
      <a className={className} href={this.props.href || 'javascript:;'} title={this.props.title}
         onClick={this.handleClick} {... 'style' in this.props ? {style: this.props.style} : {}}>
         {('button' in this.props) && this.props.button != 'text'
           ? <span className="button__content">{content}</span>
           : content}
      </a>
    );
  }
});

export let ToolTipLink = React.createClass({
  getInitialState: function() {
    return {
      showTooltip: false,
    };
  },
  handleClick: function() {
    if (this.props.tooltip) {
      this.setState({
        showTooltip: !this.state.showTooltip,
      });
    }
    if (this.props.onClick) {
      this.props.onClick();
    }
  },
  handleTooltipMouseOut: function() {
    this.setState({
      showTooltip: false,
    });
  },
  render: function() {
    const linkClass = 'tooltip-link__link ' + (this.props.className ? this.props.className + '__link' : '') +
                      (this.props.button ? ' button-block button-' + this.props.button : '') +
                      (this.props.hidden ? ' hidden' : '') +
                      (this.props.disabled ? ' disabled' : '');
    const toolTipClass = 'tooltip-link__tooltip ' + (this.props.className ? this.props.className + '__tooltip' : '');

    return (
      <span className={'tooltip-link ' + (this.props.className || '')}>
        <a className={linkClass} href={this.props.href || 'javascript:;'}
           title={this.props.title} onClick={this.handleClick}>
          {this.props.icon ? <Icon icon={this.props.icon} />  : null }
          {this.props.label}
        </a>
        {(!this.props.tooltip ? null :
          <ToolTip className={toolTipClass} open={this.state.showTooltip} onMouseOut={this.handleTooltipMouseOut}>
            {this.props.tooltip}
          </ToolTip>
        )}
      </span>
    );
  }
});
