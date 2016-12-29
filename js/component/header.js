import React from 'react';
import {Link} from './link.js';

var Header = React.createClass({
  getInitialState: function() {
    return {
      title: "LBRY",
      isScrolled: false
    };
  },
  componentWillMount: function() {
    new MutationObserver(function(mutations) {
      this.setState({ title: mutations[0].target.textContent });
    }.bind(this)).observe(
      document.querySelector('title'),
      { subtree: true, characterData: true, childList: true }
    );
  },
  componentDidMount: function() {
    document.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount: function() {
    document.removeEventListener('scroll', this.handleScroll);
    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }
  },
  handleScroll: function() {
    this.setState({
      isScrolled: document.body.scrollTop > 0
    });
  },
  onQueryChange: function(event) {

    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }

    //@TODO: Switch to React.js timing
    var searchTerm = event.target.value;
    this.userTypingTimer = setTimeout(() => {
      this.props.onSearch(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower

  },
  render: function() {
    return (
      <header id="header" className={ (this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled') + ' ' + (this.props.links ? 'header-with-subnav' : 'header-no-subnav') }>
        <div className="header-top-bar">
          <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
          <h1>{ this.state.title }</h1>
          <div className="header-search">
            <input type="search" onChange={this.onQueryChange}
                 placeholder="Find movies, music, games, and more"/>
          </div>
        </div>
        {
          this.props.links ?
            <SubHeader links={this.props.links} viewingPage={this.props.viewingPage} /> :
            ''
        }
      </header>
    );
  }
});

var SubHeader =  React.createClass({
  render: function() {
    var links = [],
        viewingUrl = '?' + this.props.viewingPage;
    
    for (let link of Object.keys(this.props.links)) {
      links.push(
        <a href={link} key={link} className={ viewingUrl == link ? 'sub-header-selected' : 'sub-header-unselected' }>
          {this.props.links[link]}
        </a>
      );
    }
    return (
      <nav className="sub-header">
        {links}
      </nav>
    );
  }
});

export default Header;
