import React from 'react'
import Router from 'component/router'
import Drawer from 'component/drawer';
import Header from 'component/header.js';
import ErrorModal from 'component/errorModal'
import DownloadingModal from 'component/downloadingModal'
import UpgradeModal from 'component/upgradeModal'
import {Line} from 'rc-progress';

const App = React.createClass({
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
      modal,
      drawerOpen,
      headerLinks,
      search,
      searchTerm,
    } = this.props
    const searchQuery = (currentPage == 'discover' && searchTerm ? searchTerm : '')

    return (
      currentPage == 'watch' ?
        <Router /> :
        <div id="window" className={ drawerOpen ? 'drawer-open' : 'drawer-closed' }>
          <Drawer onCloseDrawer={closeDrawer} viewingPage={currentPage} />
          <div id="main-content" className={ headerLinks ? 'with-sub-nav' : 'no-sub-nav' }>
            <Header onOpenDrawer={openDrawer} initialQuery={searchQuery} onSearch={search} links={headerLinks} />
            <Router />
          </div>
          {modal == 'upgrade' && <UpgradeModal />}
          {modal == 'downloading' && <DownloadingModal />}
          {modal == 'error' && <ErrorModal />}
        </div>
    );
  }
});

export default App
