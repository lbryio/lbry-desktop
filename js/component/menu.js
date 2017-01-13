import React from 'react';
import {Icon} from './common.js';
import {Link} from '../component/link.js';

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
  onMenuIconClick: function(e) {
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
      <div className="button-container">
        <Link ref={(span) => this._menuButton = span} icon="icon-ellipsis-v" onClick={this.onMenuIconClick} />
        {this.state.menuOpen
          ? <div ref={(div) => this._menuDiv = div} className="menu">
              {this.props.children}
            </div>
          : null}
      </div>
    );
  }
});