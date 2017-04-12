import React from 'react';
import {Line} from 'rc-progress';

import lbry from './lbry.js';
import EmailPage from './page/email.js';
import SettingsPage from './page/settings.js';
import HelpPage from './page/help.js';
import WatchPage from './page/watch.js';
import ReportPage from './page/report.js';
import StartPage from './page/start.js';
import RewardsPage from './page/rewards.js';
import RewardPage from './page/reward.js';
import WalletPage from './page/wallet.js';
import ShowPage from './page/show.js';
import PublishPage from './page/publish.js';
import DiscoverPage from './page/discover.js';
import DeveloperPage from './page/developer.js';
import {FileListDownloaded, FileListPublished} from './page/file-list.js';
import Drawer from './component/drawer.js';
import Header from './component/header.js';
import {Modal, ExpandableModal} from './component/modal.js';
import {Link} from './component/link.js';


const {remote, ipcRenderer, shell} = require('electron');
const {download} = remote.require('electron-dl');
const path = require('path');
const app = require('electron').remote.app;
const fs = remote.require('fs');


var App = React.createClass({
  _error_key_labels: {
    connectionString: 'API connection string',
    method: 'Method',
    params: 'Parameters',
    code: 'Error code',
    message: 'Error message',
    data: 'Error data',
  },
  _fullScreenPages: ['watch'],

  _upgradeDownloadItem: null,
  _isMounted: false,
  _version: null,
  getUpdateUrl: function() {
    switch (process.platform) {
      case 'darwin':
        return 'https://lbry.io/get/lbry.dmg';
      case 'linux':
        return 'https://lbry.io/get/lbry.deb';
      case 'win32':
        return 'https://lbry.io/get/lbry.exe';
      default:
        throw 'Unknown platform';
    }
  },
  // Hard code the filenames as a temporary workaround, because
  // electron-dl throws errors when you try to get the filename
  getUpgradeFilename: function() {
    switch (process.platform) {
      case 'darwin':
        return `LBRY-${this._version}.dmg`;
      case 'linux':
        return `LBRY_${this._version}_amd64.deb`;
      case 'windows':
        return `LBRY.Setup.${this._version}.exe`;
      default:
        throw 'Unknown platform';
    }
  },
  getViewingPageAndArgs: function(address) {
    // For now, routes are in format ?page or ?page=args
    let [isMatch, viewingPage, pageArgs] = address.match(/\??([^=]*)(?:=(.*))?/);
    return {
      viewingPage: viewingPage,
      pageArgs: pageArgs === undefined ? null : pageArgs
    };
  },
  getInitialState: function() {
    var match, param, val, viewingPage, pageArgs,
        drawerOpenRaw = sessionStorage.getItem('drawerOpen');

    return Object.assign(this.getViewingPageAndArgs(window.location.search), {
      drawerOpen: drawerOpenRaw !== null ? JSON.parse(drawerOpenRaw) : true,
      errorInfo: null,
      modal: null,
      downloadProgress: null,
      downloadComplete: false,
    });
  },
  componentWillMount: function() {
    document.addEventListener('unhandledError', (event) => {
      this.alertError(event.detail);
    });

    //open links in external browser and skip full redraw on changing page
    document.addEventListener('click', (event) => {
      var target = event.target;
      while (target && target !== document) {
        if (target.matches('a[href^="http"]')) {
          event.preventDefault();
          shell.openExternal(target.href);
          return;
        }
        if (target.matches('a[href^="?"]')) {
          event.preventDefault();
          if (this._isMounted) {
            history.pushState({}, document.title, target.getAttribute('href'));
            this.registerHistoryPop();
            this.setState(this.getViewingPageAndArgs(target.getAttribute('href')));
          }
        }
        target = target.parentNode;
      }
    });

    if (!sessionStorage.getItem('upgradeSkipped')) {
      lbry.checkNewVersionAvailable(({isAvailable}) => {
        if (!isAvailable) {
          return;
        }

        lbry.getVersionInfo((versionInfo) => {
          this._version = versionInfo.lbrynet_version;
          this.setState({
            modal: 'upgrade',
          });
        });
      });
    }
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
  componentDidMount: function() {
    this._isMounted = true;
  },
  componentWillUnmount: function() {
    this._isMounted = false;
  },
  registerHistoryPop: function() {
    window.addEventListener("popstate", function() {
      this.setState(this.getViewingPageAndArgs(location.pathname));
    }.bind(this));
  },
  handleUpgradeClicked: function() {
    // Make a new directory within temp directory so the filename is guaranteed to be available
    const dir = fs.mkdtempSync(app.getPath('temp') + require('path').sep);

    let options = {
      onProgress: (p) => this.setState({downloadProgress: Math.round(p * 100)}),
      directory: dir,
    };
    download(remote.getCurrentWindow(), this.getUpdateUrl(), options)
      .then(downloadItem => {
        /**
         * TODO: get the download path directly from the download object. It should just be
         * downloadItem.getSavePath(), but the copy on the main process is being garbage collected
         * too soon.
         */

        this._upgradeDownloadItem = downloadItem;
        this._upgradeDownloadPath = path.join(dir, this.getUpgradeFilename());
        this.setState({
          downloadComplete: true
        });
      });
    this.setState({modal: 'downloading'});
  },
  handleStartUpgradeClicked: function() {
    ipcRenderer.send('upgrade', this._upgradeDownloadPath);
  },
  cancelUpgrade: function() {
    if (this._upgradeDownloadItem) {
      /*
       * Right now the remote reference to the download item gets garbage collected as soon as the
       * the download is over (maybe even earlier), so trying to cancel a finished download may
       * throw an error.
       */
      try {
        this._upgradeDownloadItem.cancel();
      } catch (err) {
        // Do nothing
      }
    }
    this.setState({
      downloadProgress: null,
      downloadComplete: false,
      modal: null,
    });
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
      errorInfoList.push(<li key={key}><strong>{label}</strong>: <code>{val}</code></li>);
    }

    this.setState({
      modal: 'error',
      errorInfo: <ul className="error-modal__error-list">{errorInfoList}</ul>,
    });
  },
  getHeaderLinks: function()
  {
    switch(this.state.viewingPage)
    {
      case 'wallet':
      case 'send':
      case 'receive':
      case 'rewards':
        return {
          '?wallet': 'Overview',
          '?send': 'Send',
          '?receive': 'Receive',
          '?rewards': 'Rewards',
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
        return <WatchPage uri={this.state.pageArgs} />;
      case 'report':
        return <ReportPage />;
      case 'downloaded':
        return <FileListDownloaded />;
      case 'published':
        return <FileListPublished />;
      case 'start':
        return <StartPage />;
      case 'rewards':
        return <RewardsPage />;
      case 'wallet':
      case 'send':
      case 'receive':
        return <WalletPage viewingPage={this.state.viewingPage} />;
      case 'show':
        return <ShowPage uri={this.state.pageArgs} />;
      case 'publish':
        return <PublishPage />;
      case 'email':
        return <EmailPage />;
      case 'developer':
        return <DeveloperPage />;
      case 'discover':
      default:
        return <DiscoverPage showWelcome={this.state.justRegistered} {... this.state.pageArgs !== null ? {query: this.state.pageArgs} : {} } />;
    }
  },
  render: function() {
    var mainContent = this.getMainContent(),
        headerLinks = this.getHeaderLinks(),
        searchQuery = this.state.viewingPage == 'discover' && this.state.pageArgs ? this.state.pageArgs : '';

    return (
      this._fullScreenPages.includes(this.state.viewingPage) ?
        mainContent :
        <div id="window" className={ this.state.drawerOpen ? 'drawer-open' : 'drawer-closed' }>
          <Drawer onCloseDrawer={this.closeDrawer} viewingPage={this.state.viewingPage} />
          <div id="main-content" className={ headerLinks ? 'with-sub-nav' : 'no-sub-nav' }>
            <Header onOpenDrawer={this.openDrawer} initialQuery={searchQuery} onSearch={this.onSearch} links={headerLinks} viewingPage={this.state.viewingPage} />
            {mainContent}
          </div>
          <Modal isOpen={this.state.modal == 'upgrade'} contentLabel="Update available"
                 type="confirm" confirmButtonLabel="Upgrade" abortButtonLabel="Skip"
                 onConfirmed={this.handleUpgradeClicked} onAborted={this.handleSkipClicked}>
            Your version of LBRY is out of date and may be unreliable or insecure.
          </Modal>
          <Modal isOpen={this.state.modal == 'downloading'} contentLabel="Downloading Update" type="custom">
            Downloading Update{this.state.downloadProgress ? `: ${this.state.downloadProgress}%` : null}
            <Line percent={this.state.downloadProgress} strokeWidth="4"/>
            {this.state.downloadComplete ? (
               <div>
                 <br />
                 <p>Click "Begin Upgrade" to start the upgrade process.</p>
                 <p>The app will close, and you will be prompted to install the latest version of LBRY.</p>
                 <p>After the install is complete, please reopen the app.</p>
               </div>
             ) : null }
            <div className="modal__buttons">
              {this.state.downloadComplete
                ? <Link button="primary" label="Begin Upgrade" className="modal__button" onClick={this.handleStartUpgradeClicked} />
                : null}
              <Link button="alt" label="Cancel" className="modal__button" onClick={this.cancelUpgrade} />
            </div>
          </Modal>
          <ExpandableModal isOpen={this.state.modal == 'error'} contentLabel="Error" className="error-modal"
                           overlayClassName="error-modal-overlay" onConfirmed={this.closeModal}
                           extraContent={this.state.errorInfo}>
            <h3 className="modal__header">Error</h3>

            <div className="error-modal__content">
              <div><img className="error-modal__warning-symbol" src={lbry.imagePath('warning.png')} /></div>
              <p>We're sorry that LBRY has encountered an error. This has been reported and we will investigate the problem.</p>
            </div>
          </ExpandableModal>
        </div>
    );
  }
});


export default App;
