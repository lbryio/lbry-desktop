var App = React.createClass({
  _error_key_labels: {
    connectionString: 'API connection string',
    method: 'Method',
    params: 'Parameters',
    code: 'Error code',
    message: 'Error message',
    data: 'Error data',
  },

  getInitialState: function() {
    // For now, routes are in format ?page or ?page=args
    var match, param, val, viewingPage,
        drawerOpenRaw = sessionStorage.getItem('drawerOpen');

    [match, viewingPage, val] = window.location.search.match(/\??([^=]*)(?:=(.*))?/);


    return {
      viewingPage: viewingPage,
      drawerOpen: drawerOpenRaw !== null ? JSON.parse(drawerOpenRaw) : true,
      pageArgs: val,
      errorInfo: null,
      modal: null,
      startNotice: null,
      updateUrl: null,
      isOldOSX: null,
    };
  },
  componentDidMount: function() {
    lbry.getStartNotice(function(notice) {
      if (notice) {
        this.setState({
          modal: 'startNotice',
          startNotice: notice
        });
      }
    });
  },
  componentWillMount: function() {
    document.addEventListener('unhandledError', (event) => {
      this.alertError(event.detail);
    });

    lbry.checkNewVersionAvailable((isAvailable) => {
      if (!isAvailable || sessionStorage.getItem('upgradeSkipped')) {
        return;
      }

      lbry.getVersionInfo((versionInfo) => {
        var isOldOSX = false;
        if (versionInfo.os_system == 'Darwin') {
          var updateUrl = 'https://lbry.io/get/lbry.dmg';

          var maj, min, patch;
          [maj, min, patch] = versionInfo.lbrynet_version.split('.');
          if (maj == 0 && min <= 2 && patch <= 2) {
            isOldOSX = true;
          }
        } else if (versionInfo.os_system == 'Linux') {
          var updateUrl = 'https://lbry.io/get/lbry.deb';
        } else if (versionInfo.os_system == 'Windows') {
          var updateUrl = 'https://lbry.io/get/lbry.msi';
        } else {
          var updateUrl = 'https://lbry.io/get';
        }

        this.setState({
          modal: 'upgrade',
          isOldOSX: isOldOSX,
          updateUrl: updateUrl,
        })
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
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  handleUpgradeClicked: function() {
    lbry.stop();
    window.location = this.state.updateUrl;
  },
  handleSkipClicked: function() {
    sessionStorage.setItem('upgradeSkipped', true);
    this.setState({
      modal: null,
    });
  },
  onSearch: function(term) {
    this.setState({
      viewingPage: 'discover',
      pageArgs: term
    });
  },
  alertError: function(error) {
    var errorInfoList = [];
    for (let key of Object.keys(error)) {
      let val = typeof error[key] == 'string' ? error[key] : JSON.stringify(error[key]);
      let label = this._error_key_labels[key];
      errorInfoList.push(<li><strong>{label}</strong>: <code>{val}</code></li>);
    }

    this.setState({
      modal: 'error',
      errorInfo: <ul className="modal__error-list">{errorInfoList}</ul>,
    });
  },
  getHeaderLinks: function()
  {
    switch(this.state.viewingPage)
    {
      case 'wallet':
      case 'send':
      case 'receive':
      case 'claim':
      case 'referral':
        return {
          '?wallet' : 'Overview',
          '?send' : 'Send',
          '?receive' : 'Receive',
          '?claim' : 'Claim Beta Code',
          '?referral' : 'Check Referral Credit',
        };
      case 'downloaded':
      case 'published':
        return {
          '?downloaded': 'Downloaded',
          '?published': 'Published',
        };
      default:
        return null;
    }
  },
  getMainContent: function()
  {
    switch(this.state.viewingPage)
    {
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      case 'watch':
        return <WatchPage name={this.state.pageArgs} />;
      case 'report':
        return <ReportPage />;
      case 'downloaded':
        return <MyFilesPage show="downloaded" />;
      case 'published':
        return <MyFilesPage show="published" />;
      case 'start':
        return <StartPage />;
      case 'claim':
        return <ClaimCodePage />;
      case 'referral':
        return <ReferralPage />;
      case 'wallet':
      case 'send':
      case 'receive':
        return <WalletPage viewingPage={this.state.viewingPage} />;
      case 'send':
        return <SendPage />;
      case 'receive':
        return <ReceivePage />;
      case 'show':
        return <DetailPage name={this.state.pageArgs} />;
      case 'publish':
        return <PublishPage />;
      case 'discover':
      default:
        return <DiscoverPage query={this.state.pageArgs} />;
    }
  },
  render: function() {
    var mainContent = this.getMainContent(),
        headerLinks = this.getHeaderLinks();

    return (
      this.state.viewingPage == 'watch' ?
        mainContent :
        <div id="window" className={ this.state.drawerOpen ? 'drawer-open' : 'drawer-closed' }>
          <Drawer onCloseDrawer={this.closeDrawer} viewingPage={this.state.viewingPage} />
          <div id="main-content" className={ headerLinks ? 'with-sub-nav' : 'no-sub-nav' }>
            <Header onOpenDrawer={this.openDrawer} onSearch={this.onSearch} links={headerLinks} viewingPage={this.state.viewingPage} />
            {mainContent}
          </div>
          <Modal isOpen={this.state.modal == 'startNotice'} onConfirmed={this.closeModal}>
            {this.state.startNotice}
          </Modal>
          <Modal isOpen={this.state.modal == 'upgrade'} type="confirm" confirmButtonLabel="Upgrade" abortButtonLabel="Skip"
                 onConfirmed={this.handleUpgradeClicked} onAborted={this.handleSkipClicked} >
            <p>The version of LBRY you're using is not up to date. Choose "Upgrade" to get the latest version.</p>
            {this.state.isOldOSX
              ? <p>Before installing the new version, make sure to exit LBRY. If you started the app, click the LBRY icon in your status bar and choose "Quit."</p>
              : null}

          </Modal>
          <Modal isOpen={this.state.modal == 'error'} className='error-modal'>
            <h3>Error</h3>
            <p>Sorry, but LBRY has encountered an error! Please <Link href="/?report" label="report a bug" /> and include the details below.</p>
            {this.state.errorInfo}
          </Modal>
        </div>
    );
  }
});
