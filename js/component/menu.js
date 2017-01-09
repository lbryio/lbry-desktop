import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from './common.js';

export let Menu = React.createClass({
  propTypes: {
    onClickOut: React.PropTypes.func.isRequired,
  },
  handleWindowClick: function(e) {
    if (!this._div.contains(e.target)) {
      // Menu is open and user clicked outside of it
      this.props.onClickOut();
    }
  },
  componentDidMount: function() {
    window.addEventListener('click', this.handleWindowClick, false);
  },
  componentWillUnmount: function() {
    window.removeEventListener('click', this.handleWindowClick, false);
  },
  render: function() {
    const {onClickOut, ...other} = this.props;
    return (
      <div ref={(div) => this._div = div} className={'menu ' + (this.props.className || '')}
           {... other}>
        {this.props.children}
      </div>
    );
  }
});

export let MenuItem = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    label: React.PropTypes.string,
    icon: React.PropTypes.string,
    onClick: React.PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      iconPosition: 'left',
    }
  },
  render: function() {
    var icon = (this.props.icon ? <Icon icon={this.props.icon} fixed /> : null);

    return (
      <a className="button-text menu__menu-item" onClick={this.props.onClick}
         href={this.props.href || 'javascript:'} label={this.props.label}>
        {this.props.iconPosition == 'left' ? icon : null}
        {this.props.label}
        {this.props.iconPosition == 'left' ? null : icon}
      </a>
    );
  }
});
