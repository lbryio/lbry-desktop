// @flow
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import classnames from 'classnames';
import Router from 'component/router/index';
import ReactModal from 'react-modal';
import { openContextMenu } from 'util/context-menu';
import useKonamiListener from 'util/enhanced-layout';
import FileRenderFloating from 'component/fileRenderFloating';
import { withRouter } from 'react-router';
import usePersistedState from 'effects/use-persisted-state';
import LANGUAGES from 'constants/languages';
import useZoom from 'effects/use-zoom';
import useHistoryNav from 'effects/use-history-nav';
import LANGUAGE_MIGRATIONS from 'constants/language-migrations';

import FileDrop from 'component/fileDrop';
import ModalRouter from 'modal/modalRouter';
import Nag from 'component/common/nag';

import SyncFatalError from 'component/syncFatalError';
import Yrbl from 'component/yrbl';

// ****************************************************************************

export const MAIN_WRAPPER_CLASS = 'main-wrapper';
export const IS_MAC = navigator.userAgent.indexOf('Mac OS X') !== -1;

// button numbers pulled from https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const MOUSE_BACK_BTN = 3;
const MOUSE_FORWARD_BTN = 4;

type Props = {
  language: string,
  languages: Array<string>,
  theme: string,
  user: ?{ id: string, has_verified_email: boolean, is_reward_approved: boolean },
  location: { pathname: string, hash: string, search: string },
  history: {
    goBack: () => void,
    goForward: () => void,
    index: number,
    length: number,
    push: (string) => void,
  },
  fetchChannelListMine: () => void,
  fetchCollectionListMine: () => void,
  signIn: () => void,
  requestDownloadUpgrade: () => void,
  onSignedIn: () => void,
  setLanguage: (string) => void,
  isUpgradeAvailable: boolean,
  autoUpdateDownloaded: boolean,
  updatePreferences: () => Promise<any>,
  getWalletSyncPref: () => Promise<any>,
  uploadCount: number,
  balance: ?number,
  syncError: ?string,
  syncEnabled: boolean,
  rewards: Array<Reward>,
  setReferrer: (string, boolean) => void,
  isAuthenticated: boolean,
  socketConnect: () => void,
  syncLoop: (?boolean) => void,
  currentModal: any,
  syncFatalError: boolean,
  activeChannelId: ?string,
  myChannelClaimIds: ?Array<string>,
  subscriptions: Array<Subscription>,
  setActiveChannelIfNotSet: () => void,
  setIncognito: (boolean) => void,
  fetchModBlockedList: () => void,
  resolveUris: (Array<string>) => void,
  fetchModAmIList: () => void,
  isUpdateModalDisplayed: boolean,
};

function App(props: Props) {
  const {
    theme,
    fetchChannelListMine,
    fetchCollectionListMine,
    autoUpdateDownloaded,
    isUpgradeAvailable,
    requestDownloadUpgrade,
    uploadCount,
    history,
    language,
    languages,
    setLanguage,
    updatePreferences,
    getWalletSyncPref,
    syncFatalError,
    myChannelClaimIds,
    activeChannelId,
    setActiveChannelIfNotSet,
    setIncognito,
    fetchModBlockedList,
    resolveUris,
    subscriptions,
    fetchModAmIList,
    isUpdateModalDisplayed,
  } = props;

  const appRef = useRef();
  const isEnhancedLayout = useKonamiListener();
  const [upgradeNagClosed, setUpgradeNagClosed] = useState(false);
  const [resolvedSubscriptions, setResolvedSubscriptions] = useState(false);
  const [langRenderKey, setLangRenderKey] = useState(0);
  const [sidebarOpen] = usePersistedState('sidebar', true);
  const showUpgradeButton = (autoUpdateDownloaded || isUpgradeAvailable) && !upgradeNagClosed;
  const useCustomScrollbar = !IS_MAC;
  const hasMyChannels = myChannelClaimIds && myChannelClaimIds.length > 0;
  const hasNoChannels = myChannelClaimIds && myChannelClaimIds.length === 0;
  const shouldMigrateLanguage = LANGUAGE_MIGRATIONS[language];
  const hasActiveChannelClaim = activeChannelId !== undefined;

  useEffect(() => {
    if (!uploadCount) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = __('There are pending uploads.'); // without setting this to something it doesn't work
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploadCount]);

  // allows user to navigate history using the forward and backward buttons on a mouse
  useEffect(() => {
    const handleForwardAndBackButtons = (e) => {
      switch (e.button) {
        case MOUSE_BACK_BTN:
          history.index > 0 && history.goBack();
          break;
        case MOUSE_FORWARD_BTN:
          history.index < history.length - 1 && history.goForward();
          break;
      }
    };
    window.addEventListener('mouseup', handleForwardAndBackButtons);
    return () => window.removeEventListener('mouseup', handleForwardAndBackButtons);
  });

  // allows user to pause miniplayer using the spacebar without the page scrolling down
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Enable ctrl +/- zooming on Desktop.
  useZoom();

  // Enable 'Alt + Left/Right' for history navigation on Desktop.
  useHistoryNav(history);

  useEffect(() => {
    const { current: wrapperElement } = appRef;
    if (wrapperElement) {
      ReactModal.setAppElement(wrapperElement);
    }

    fetchChannelListMine(); // This is fetched after a user is signed in on web
    fetchCollectionListMine();
  }, [appRef, fetchChannelListMine, fetchCollectionListMine]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (hasMyChannels && !hasActiveChannelClaim) {
      setActiveChannelIfNotSet();
    } else if (hasNoChannels) {
      setIncognito(true);
    }

    if (hasMyChannels) {
      fetchModBlockedList();
      fetchModAmIList();
    }
  }, [hasMyChannels, hasNoChannels, hasActiveChannelClaim, setActiveChannelIfNotSet, setIncognito]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    if (!languages.includes(language)) {
      setLanguage(language);

      if (document && document.documentElement && LANGUAGES[language].length >= 3) {
        document.documentElement.dir = LANGUAGES[language][2];
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, languages]);

  useEffect(() => {
    if (shouldMigrateLanguage) {
      setLanguage(shouldMigrateLanguage);
    }
  }, [shouldMigrateLanguage, setLanguage]);

  useEffect(() => {
    if (updatePreferences && getWalletSyncPref) {
      getWalletSyncPref().then(() => updatePreferences());
    }
  }, [updatePreferences, getWalletSyncPref]);

  // batch resolve subscriptions to be used by the sideNavigation component.
  // add it here so that it only resolves the first time, despite route changes.
  // useLayoutEffect because it has to be executed before the sideNavigation component requests them
  useLayoutEffect(() => {
    if (sidebarOpen && subscriptions && !resolvedSubscriptions) {
      setResolvedSubscriptions(true);
      resolveUris(subscriptions.map((sub) => sub.uri));
    }
  }, [sidebarOpen, resolvedSubscriptions, subscriptions, resolveUris, setResolvedSubscriptions]);

  useEffect(() => {
    // When language is changed or translations are fetched, we render.
    setLangRenderKey(Date.now());
  }, [language, languages]);

  if (syncFatalError) {
    return <SyncFatalError />;
  }

  return (
    <div
      className={classnames(MAIN_WRAPPER_CLASS, {
        [`${MAIN_WRAPPER_CLASS}--mac`]: IS_MAC,
        [`${MAIN_WRAPPER_CLASS}--scrollbar`]: useCustomScrollbar,
      })}
      ref={appRef}
      key={langRenderKey}
      onContextMenu={(e) => openContextMenu(e)}
    >
      <Router />
      <ModalRouter />
      <FileDrop />
      <FileRenderFloating />
      {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}

      {showUpgradeButton && !isUpdateModalDisplayed && (
        <Nag
          message={__('An upgrade is available.')}
          actionText={__('Install Now')}
          onClick={requestDownloadUpgrade}
          onClose={() => setUpgradeNagClosed(true)}
        />
      )}
    </div>
  );
}

export default withRouter(App);
