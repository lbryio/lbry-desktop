import React from 'react';
import {Icon} from './common.js';
import Link from 'component/link';

export let DropDownMenuItem = React.createClass({
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
      <a className="menu__menu-item" onClick={this.props.onClick}
         href={this.props.href || 'javascript:'} label={this.props.label}>
        {this.props.iconPosition == 'left' ? icon : null}
        {this.props.label}
        {this.props.iconPosition == 'left' ? null : icon}
      </a>
    );
  }
});

export let DropDownMenu = React.createClass({
  _isWindowClickBound: false,
  _menuDiv: null,

  getInitialState: function() {
    return {
      menuOpen: false,
    };
  },
  componentWillUnmount: function() {
    if (this._isWindowClickBound) {
      window.removeEventListener('click', this.handleWindowClick, false);
    }
  },
  handleMenuIconClick: function(e) {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
    if (!this.state.menuOpen && !this._isWindowClickBound) {
      this._isWindowClickBound = true;
      window.addEventListener('click', this.handleWindowClick, false);
      e.stopPropagation();
    }
    return false;
  },
  handleMenuClick: function(e) {
    // Event bubbles up to the menu after a link is clicked
    this.setState({
      menuOpen: false,
    });
  },
  handleWindowClick: function(e) {
    if (this.state.menuOpen &&
          (!this._menuDiv || !this._menuDiv.contains(e.target))) {
      this.setState({
        menuOpen: false
      });
    }
  },
  render: function() {
    if (!this.state.menuOpen && this._isWindowClickBound) {
      this._isWindowClickBound = false;
      window.removeEventListener('click', this.handleWindowClick, false);
    }
    return (
      <div className="menu-container">
        <Link ref={(span) => this._menuButton = span} button="text" icon="icon-ellipsis-v" onClick={this.handleMenuIconClick} />
        {this.state.menuOpen
          ? <div ref={(div) => this._menuDiv = div} className="menu" onClick={this.handleMenuClick}>
              {this.props.children}
            </div>
          : null}
      </div>
    );
  }
});