import React from 'react'

import lbry from 'lbry.js';
import Router from 'component/router'
import Header from 'component/header';
import {Modal, ExpandableModal} from 'component/modal.js';
import ErrorModal from 'component/errorModal'
import DownloadingModal from 'component/downloadingModal'
import UpgradeModal from 'component/upgradeModal'
import Link from 'component/link';
import {Line} from 'rc-progress';

const App = React.createClass({
  // Temporary workaround since electron-dl throws errors when you try to get the filename
  getViewingPageAndArgs: function(address) {
    // For now, routes are in format ?page or ?page=args
    let [isMatch, viewingPage, pageArgs] = address.match(/\??([^=]*)(?:=(.*))?/);
    return {
      viewingPage: viewingPage,
      pageArgs: pageArgs === undefined ? null : pageArgs
    };
  },
  componentWillMount: function() {
    document.addEventListener('unhandledError', (event) => {
      this.props.alertError(event.detail);
    });

    if (!this.props.upgradeSkipped) {
      this.props.checkUpgradeAvailable()
    }
  },
  render: function() {
    const {
      currentPage,
      openDrawer,
      closeDrawer,
      openModal,
      closeModal,
      modal,
      drawerOpen,
      headerLinks,
      search,
      searchTerm,
    } = this.props
    const searchQuery = (currentPage == 'discover' && searchTerm ? searchTerm : '')

    return <div id="window" className={ drawerOpen ? 'drawer-open' : 'drawer-closed' }>
      <Drawer onCloseDrawer={closeDrawer} viewingPage={currentPage} />
      <div id="main-content" className={ headerLinks ? 'with-sub-nav' : 'no-sub-nav' }>
        <Header onOpenDrawer={openDrawer} initialQuery={searchQuery} onSearch={search} links={headerLinks} />
        <Router />
      </div>
      {modal == 'upgrade' && <UpgradeModal />}
      {modal == 'downloading' && <DownloadingModal />}
      {modal == 'error' && <ErrorModal />}
    </div>
  }
});

export default App
