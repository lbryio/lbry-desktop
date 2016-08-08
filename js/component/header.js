var Header = React.createClass({
  getInitialState: function() {
    return {
      title: "LBRY",
      isScrolled: false
    };
  },
  componentWillMount: function() {
    new MutationObserver(function(mutations) {
      this.setState({ title: mutations[0].target.innerHTML });
    }.bind(this)).observe(
      document.querySelector('title'),
      { subtree: true, characterData: true, childList: true }
    );
  },
  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
  },
  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  },
  handleScroll() {
    this.setState({
      isScrolled: event.srcElement.body.scrollTop > 0
    });
  },
  onQueryChange: function(event) {

    this.props.onSearchStart();

    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }

    //@TODO: Switch to React.js timing
    this.userTypingTimer = setTimeout(this.search, 800); // 800ms delay, tweak for faster/slower

    // this.setState({
    //   searching: event.target.value.length > 0,
    //   query: event.target.value
    // });
  },
  render: function() {
    return (
      <header id="header" className={this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled'}>
        <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
        <h1>{ this.state.title }</h1>
        <input type="search" onChange={this.onQueryChange}
               placeholder="Find movies, music, games, and more"/>
      </header>
    );
  }
});