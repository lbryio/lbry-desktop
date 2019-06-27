// @flow
import React, { useEffect, useRef } from 'react';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from 'util/context-menu';
import useKonamiListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';

export const MAIN_WRAPPER_CLASS = 'main-wrapper';

type Props = {
  alertError: (string | {}) => void,
  pageTitle: ?string,
  language: string,
  theme: string,
  fetchRewards: () => void,
  fetchRewardedContent: () => void,
  fetchTransactions: () => void,
};

function App(props: Props) {
  const { theme, fetchRewards, fetchRewardedContent, fetchTransactions } = props;
  const appRef = useRef();
  const isEnhancedLayout = useKonamiListener();

  useEffect(() => {
    ReactModal.setAppElement(appRef.current);
    fetchRewardedContent();

    // @if TARGET='app'
    fetchRewards();
    fetchTransactions();
    // @endif
  }, [fetchRewards, fetchRewardedContent, fetchTransactions]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('data-mode', theme);
  }, [theme]);

  return (
    <div ref={appRef} onContextMenu={e => openContextMenu(e)}>
      <Header />

      <div className={MAIN_WRAPPER_CLASS}>
        <div className="main-wrapper-inner">
          <Router />
          <SideBar />
        </div>
      </div>

      <ModalRouter />
      {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}
    </div>
  );
}

export default App;
