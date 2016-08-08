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
  render: function() {
    var isLinux = /linux/i.test(navigator.userAgent); // @TODO: find a way to use getVersionInfo() here without messy state management
    return (
      <header id="header" className={this.state.isScrolled ? 'header-scrolled' : 'header-unscrolled'}>
        <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
        {isLinux ? <Link href="/?start" icon="icon-close" className="close-lbry-link" /> : null}
        <h1>{ this.state.title }</h1>
      </header>
    );
  }
});