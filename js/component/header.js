var Header = React.createClass({
  getInitialState: function() {
    return {
      title: "LBRY"
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
  render: function() {
    return (
      <header id="header">
        <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
        <h1>{ this.state.title }</h1>
      </header>
    );
  }
});