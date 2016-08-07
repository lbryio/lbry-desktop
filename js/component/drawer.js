var DrawerItem = React.createClass({
  render: function() {
    return <Link {...this.props} className="drawer-item" />
  }
});

var drawerImageStyle = { //@TODO: remove this, img should be properly scaled once size is settled
  height: '36px'
};

var Drawer = React.createClass({
  getInitialState: function() {
    return {
      balance: 0,
    };
  },
  componentDidMount: function() {
    lbry.getBalance(function(balance) {
      this.setState({
        balance: balance
      });
    }.bind(this));
  },
  render: function() {
    var isLinux = /linux/i.test(navigator.userAgent); // @TODO: find a way to use getVersionInfo() here without messy state management
    return (
      <nav id="drawer">
        <div id="drawer-handle">
          <Link title="Close" onClick={this.props.onCloseDrawer} icon="icon-bars" className="button-text close-drawer-link"/>
          <a href="/"><img src="./img/lbry-dark-1600x528.png" style={drawerImageStyle}/></a>
        </div>
        <DrawerItem href='/?home' label="Discover" icon="icon-search"  />
        <DrawerItem href='/?publish' label="Publish" icon="icon-upload" />
        <DrawerItem href='/?files' label="My Files" icon='icon-cloud-download' />
        <DrawerItem href="/?wallet" label={ lbry.formatCredits(this.state.balance) } icon="icon-bank" />
        <DrawerItem href='/?settings' label="Settings" icon='icon-gear' />
        <DrawerItem href='/?help' label="Help" icon='icon-question-circle' />
        {isLinux ? <DrawerItem href="/?start" label="Exit LBRY" icon="icon-close" /> : null}
      </nav>
    );
  }
});