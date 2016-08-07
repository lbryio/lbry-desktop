var Header = React.createClass({
  render: function() {
    return (
      <header id="header">
        <h1>{ document.title ? document.title : 'LBRY' }</h1>
        <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
      </header>
    );
  }
});