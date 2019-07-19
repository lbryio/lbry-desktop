// @flow
import React, { useEffect, useRef } from 'react';
import analytics from 'analytics';
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
  user: ?{ id: string },
  fetchRewards: () => void,
  fetchRewardedContent: () => void,
  fetchTransactions: () => void,
};

function App(props: Props) {
  const { theme, fetchRewards, fetchRewardedContent, fetchTransactions, user } = props;
  const appRef = useRef();
  const isEnhancedLayout = useKonamiListener();
  const userId = user && user.id;

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

  useEffect(() => {
    if (userId) {
      analytics.setUser(userId);
    }
  }, [userId]);

  return (
    <div className={MAIN_WRAPPER_CLASS} ref={appRef} onContextMenu={e => openContextMenu(e)}>
      <Header />

      <div className="main-wrapper__inner">
        <Router />
        <SideBar />
      </div>

      <ModalRouter />
      {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}
    </div>
  );
}

export default App;
