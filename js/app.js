var App = React.createClass({
  getInitialState: function() {
    // For now, routes are in format ?page or ?page=args
    var match, param, val, viewingPage,
        drawerOpenRaw = sessionStorage.getItem('drawerOpen');

    [match, param, val] = window.location.search.match(/\??([^=]*)(?:=(.*))?/);

    if (param && ['settings', 'help', 'start', 'watch', 'report', 'files', 'claim', 'show', 'wallet', 'publish'].indexOf(param) != -1) {
      viewingPage = param;
    }

    return {
      viewingPage: viewingPage ? viewingPage : 'home',
      drawerOpen: drawerOpenRaw !== null ? JSON.parse(drawerOpenRaw) : true,
      pageArgs: val,
    };
  },
  componentWillMount: function() {
    lbry.checkNewVersionAvailable(function(isAvailable) {
      if (!isAvailable) {
        return;
      }

      var message = 'The version of LBRY you\'re using is not up to date.\n\n' +
        'Choose "OK" to download the latest version."';

      lbry.getVersionInfo(function(versionInfo) {
        if (versionInfo.os_system == 'Darwin') {
          var updateUrl = 'https://lbry.io/get/lbry.dmg';

          var maj, min, patch;
          [maj, min, patch] = versionInfo.lbrynet_version.split('.');
          if (maj == 0 && min <= 2 && patch <= 2) {
            // On OS X with version <= 0.2.2, we need to notify user to close manually close LBRY
            message += '\n\nBefore installing the new version, make sure to exit LBRY, if you started the app ' +
              'click that LBRY icon in your status bar and choose "Quit."';
          }
        } else {
          var updateUrl = 'https://lbry.io/get/lbry.deb';
        }

        if (window.confirm(message)) {
          lbry.stop();
          window.location = updateUrl;
        };
      });
    });
  },
  openDrawer: function() {
    sessionStorage.setItem('drawerOpen', true);
    this.setState({ drawerOpen: true });
  },
  closeDrawer: function() {
    sessionStorage.setItem('drawerOpen', false);
    this.setState({ drawerOpen: false });
  },
  render: function() {
    console.log(this.state);
    return (
      <div id="window" className={ this.state.drawerOpen ? 'drawer-open' : 'drawer-closed' }>
        <Drawer onCloseDrawer={this.closeDrawer} />
        <div id="main-content">
          <Header onOpenDrawer={this.openDrawer} />
          {(() => {
            switch(this.state.viewingPage)
            {
              case 'home': return <HomePage />;
              case 'settings': return <SettingsPage />;
              case 'help': return <HelpPage />;
              case 'watch': return <WatchPage name={this.state.pageArgs}/>;
              case 'report': return <ReportPage />;
              case 'files': return <MyFilesPage />;
              case 'start': return <StartPage />;
              case 'claim': return <ClaimCodePage />;
              case 'wallet': return <WalletPage />;
              case 'show':  return <DetailPage name={this.state.pageArgs}/>;
              case 'wallet': return <WalletPage />;
              case 'publish': return <PublishPage />;
            }
          })()}
        </div>
      </div>
    );
  }
});