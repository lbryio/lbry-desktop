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
          <Link title="Close" onClick={this.props.onCloseDrawer} icon="icon-bars" />
        </div>
        <Link href='/?home' label="Discover" icon="icon-search" />
        <Link icon="icon-bank" href="/?wallet" label={<CreditAmount amount={this.state.balance}/>} />
        <Link href='/?publish' label="Publish" icon="icon-upload" />
        <Link href='/?files' label="My Files" icon='icon-cloud-download' />
        <Link href='/?settings' label="Settings" icon='icon-gear' />
        <Link href='/?help' label="Help" icon='icon-question-circle' />
        {isLinux ? <Link href="/?start" label="Exit LBRY" icon="icon-close" /> : null}
      </nav>
    );
  }
});