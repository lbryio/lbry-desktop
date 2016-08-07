var topBarStyle = {
    'float': 'right',
    'position': 'absolute',
    'right': 0,
    'top': 0
  },
  balanceStyle = {
    'marginRight': '5px',
    'position': 'relative',
    'top': '1px',
  },
  menuDropdownStyle = {
  position: 'absolute',
  top: '26px',
  right: '0px',
};

var TopBar = React.createClass({
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
  onClose: function() {
    window.location.href = "?start";
  },
  render: function() {
    var isLinux = /linux/i.test(navigator.userAgent); // @TODO: find a way to use getVersionInfo() here without messy state management
    return (
      <span className='top-bar' style={topBarStyle}>
        <Link icon="icon-bank" href="/?wallet" label={<CreditAmount amount={this.state.balance}/>} style={balanceStyle} />
        <Link href='/?publish' label="Publish" icon="icon-upload" button="text" />
        <Link ref="menuButton" title="LBRY Menu" icon="icon-bars" />
        <div style={menuDropdownStyle}>
          <Menu toggleButton={this.refs.menuButton} >
            <MenuItem href='/?files' label="My Files" icon='icon-cloud-download' />
            <MenuItem href='/?settings' label="Settings" icon='icon-gear' />
            <MenuItem href='/?help' label="Help" icon='icon-question-circle' />
            {isLinux ? <MenuItem href="/?start" label="Exit LBRY" icon="icon-close" />
              : null}
          </Menu>
        </div>
      </span>
    );
  }
});

var subPageLogoStyle = {
  maxWidth: '150px',
  display: 'block',
  marginTop: '36px',
};

var SubPageLogo = React.createClass({
  render: function() {
    return <a href="/"><img src="img/lbry-dark-1600x528.png" style={subPageLogoStyle} /></a>;
  }
});

var headerStyle = {
    padding: '12px 12px 36px',
    position: 'relative'
  },
  headerImageStyle = { //@TODO: remove this, img should be properly scaled once size is settled
    height: '48px'
  };

var Header = React.createClass({
  render: function() {
    return (
      <header style={headerStyle}>
        <Link onClick={this.props.onOpenDrawer} icon="icon-bars" className="open-drawer-link" />
        <a href="/"><img src="./img/lbry-dark-1600x528.png" style={headerImageStyle}/></a>
      </header>
    );
  }
});