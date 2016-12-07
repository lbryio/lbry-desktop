import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from './common.js';

// Generic menu styles
var menuStyle = {
  whiteSpace: 'nowrap'
};

var Menu = React.createClass({
  handleWindowClick: function(e) {
    if (this.props.toggleButton && ReactDOM.findDOMNode(this.props.toggleButton).contains(e.target)) {
      // Toggle button was clicked
      this.setState({
        open: !this.state.open
      });
    } else if (this.state.open && !this.refs.div.contains(e.target)) {
      // Menu is open and user clicked outside of it
      this.setState({
        open: false
      });
    }
  },
  propTypes: {
    openButton: React.PropTypes.element,
  },
  getInitialState: function() {
    return {
      open: false,
    };
  },
  componentDidMount: function() {
    window.addEventListener('click', this.handleWindowClick, false);
  },
  componentWillUnmount: function() {
    window.removeEventListener('click', this.handleWindowClick, false);
  },
  render: function() {
    return (
      <div ref='div' style={menuStyle} className={this.state.open ? '' : 'hidden'}>
        {this.props.children}
      </div>
    );
  }
});

var menuItemStyle = {
  display: 'block',
};
var MenuItem = React.createClass({
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
      <a style={menuItemStyle} className="button-text no-underline" onClick={this.props.onClick}
         href={this.props.href || 'javascript:'} label={this.props.label}>
        {this.props.iconPosition == 'left' ? icon : null}
        {this.props.label}
        {this.props.iconPosition == 'left' ? null : icon}
      </a>
    );
  }
});

export default Menu;
