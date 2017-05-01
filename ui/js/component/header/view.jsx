import React from 'react';
import {Icon} from 'component/common.js';
import Link from 'component/link';

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
      this.props.search(searchTerm);
    }, 800); // 800ms delay, tweak for faster/slower

  },
  render: function() {
    return (
      <header id="header" className={ (this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled') + ' ' + (this.props.links ? 'header-with-subnav' : 'header-no-subnav') }>
        <div className="header-top-bar">
          <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
          <h1>{ this.props.pageTitle }</h1>
          <div className="header-search">
            <Icon icon="icon-search" />
            <input type="search" onChange={this.onQueryChange}
              onFocus={() => this.props.activateSearch()}
              onBlur={() => this.props.deactivateSearch()}
              placeholder="Find movies, music, games, and more" />
          </div>
        </div>
        {
          this.props.links ?
            <SubHeader {...this.props} /> :
            ''
        }
      </header>
    );
  }
});

const SubHeader = (props) => {
  const {
    subLinks,
    currentPage,
    navigate,
  } = props

  const links = []

  for(let link of Object.keys(subLinks)) {
    links.push(
      <a href="#" onClick={() => navigate(link)} key={link} className={link == currentPage ? 'sub-header-selected' : 'sub-header-unselected' }>
        {subLinks[link]}
      </a>
    )
  }

  return (
    <nav className="sub-header">
      {links}
    </nav>
  )
}

export default Header;
