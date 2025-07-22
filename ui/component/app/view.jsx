// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import classnames from 'classnames';
import analytics from 'analytics';
import Router from 'component/router/index';
import ReactModal from 'react-modal';
import { openContextMenu } from 'util/context-menu';
import useKonamiListener from 'util/enhanced-layout';
import FileRenderFloating from 'component/fileRenderFloating';
import { withRouter } from 'react-router';
import usePrevious from 'effects/use-previous';
import REWARDS from 'rewards';
import usePersistedState from 'effects/use-persisted-state';
import LANGUAGES from 'constants/languages';
import useZoom from 'effects/use-zoom';
import useHistoryNav from 'effects/use-history-nav';
import LANGUAGE_MIGRATIONS from 'constants/language-migrations';

import FileDrop from 'component/fileDrop';
import ModalRouter from 'modal/modalRouter';
import Nag from 'component/common/nag';
import NotificationManager from 'component/notificationManager';

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
  fetchAccessToken: () => void,
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
    user,
    fetchAccessToken,
    fetchChannelListMine,
    fetchCollectionListMine,
    signIn,
    autoUpdateDownloaded,
    isUpgradeAvailable,
    requestDownloadUpgrade,
    uploadCount,
    history,
    syncError,
    language,
    languages,
    setLanguage,
    updatePreferences,
    getWalletSyncPref,
    rewards,
    setReferrer,
    isAuthenticated,
    syncLoop,
    currentModal,
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
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [readyForSync, setReadyForSync] = useState(false);
  const [readyForPrefs, setReadyForPrefs] = useState(false);
  const hasVerifiedEmail = user && Boolean(user.has_verified_email);
  const isRewardApproved = user && user.is_reward_approved;
  const previousHasVerifiedEmail = usePrevious(hasVerifiedEmail);
  const previousRewardApproved = usePrevious(isRewardApproved);
  const { pathname, search } = props.location;
  const [upgradeNagClosed, setUpgradeNagClosed] = useState(false);
  const [resolvedSubscriptions, setResolvedSubscriptions] = useState(false);
  // const [retryingSync, setRetryingSync] = useState(false);
  const [langRenderKey, setLangRenderKey] = useState(0);
  const [sidebarOpen] = usePersistedState('sidebar', true);
  const showUpgradeButton = (autoUpdateDownloaded || isUpgradeAvailable) && !upgradeNagClosed;
  // referral claiming
  const referredRewardAvailable = rewards && rewards.some((reward) => reward.reward_type === REWARDS.TYPE_REFEREE);
  const urlParams = new URLSearchParams(search);
  const rawReferrerParam = urlParams.get('r');
  const sanitizedReferrerParam = rawReferrerParam && rawReferrerParam.replace(':', '#');
  const userId = user && user.id;
  const useCustomScrollbar = !IS_MAC;
  const hasMyChannels = myChannelClaimIds && myChannelClaimIds.length > 0;
  const hasNoChannels = myChannelClaimIds && myChannelClaimIds.length === 0;
  const shouldMigrateLanguage = LANGUAGE_MIGRATIONS[language];
  const hasActiveChannelClaim = activeChannelId !== undefined;
  const isPersonalized = hasVerifiedEmail;

  useEffect(() => {
    if (userId) {
      analytics.setUser(userId);
    }
  }, [userId]);

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
  // @if TARGET='app'
  useZoom();
  // @endif

  // Enable 'Alt + Left/Right' for history navigation on Desktop.
  // @if TARGET='app'
  useHistoryNav(history);
  // @endif

  useEffect(() => {
    if (referredRewardAvailable && sanitizedReferrerParam && isRewardApproved) {
      setReferrer(sanitizedReferrerParam, true);
    } else if (referredRewardAvailable && sanitizedReferrerParam) {
      setReferrer(sanitizedReferrerParam, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedReferrerParam, isRewardApproved, referredRewardAvailable]);

  useEffect(() => {
    const { current: wrapperElement } = appRef;
    if (wrapperElement) {
      ReactModal.setAppElement(wrapperElement);
    }

    fetchAccessToken();

    // @if TARGET='app'
    fetchChannelListMine(); // This is fetched after a user is signed in on web
    fetchCollectionListMine();
    // @endif
  }, [appRef, fetchAccessToken, fetchChannelListMine, fetchCollectionListMine]);

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
    // Check that previousHasVerifiedEmail was not undefined instead of just not truthy
    // This ensures we don't fire the emailVerified event on the initial user fetch
    if (previousHasVerifiedEmail === false && hasVerifiedEmail) {
      analytics.emailVerifiedEvent();
    }
  }, [previousHasVerifiedEmail, hasVerifiedEmail, signIn]);

  useEffect(() => {
    if (previousRewardApproved === false && isRewardApproved) {
      analytics.rewardEligibleEvent();
    }
  }, [previousRewardApproved, isRewardApproved]);

  useEffect(() => {
    if (updatePreferences && getWalletSyncPref && readyForPrefs) {
      getWalletSyncPref()
        .then(() => updatePreferences())
        .then(() => {
          setReadyForSync(true);
        });
    }
  }, [updatePreferences, getWalletSyncPref, setReadyForSync, readyForPrefs, hasVerifiedEmail]);

  // ready for sync syncs, however after signin when hasVerifiedEmail, that syncs too.
  useEffect(() => {
    // signInSyncPref is cleared after sharedState loop.
    if (readyForSync && hasVerifiedEmail) {
      // In case we are syncing.
      syncLoop();
    }
  }, [readyForSync, hasVerifiedEmail, syncLoop]);

  // We know someone is logging in or not when we get their user object
  // We'll use this to determine when it's time to pull preferences
  // This will no longer work if desktop users no longer get a user object from lbryinc
  useEffect(() => {
    if (user) {
      setReadyForPrefs(true);
    }
  }, [user, setReadyForPrefs]);

  useEffect(() => {
    if (syncError && isAuthenticated && !pathname.includes(PAGES.AUTH_WALLET_PASSWORD) && !currentModal) {
      history.push(`/$/${PAGES.AUTH_WALLET_PASSWORD}?redirect=${pathname}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncError, pathname, isAuthenticated]);

  // Keep this at the end to ensure initial setup effects are run first
  useEffect(() => {
    if (!hasSignedIn && hasVerifiedEmail) {
      signIn();
      setHasSignedIn(true);
    }
  }, [hasVerifiedEmail, signIn, hasSignedIn]);

  // batch resolve subscriptions to be used by the sideNavigation component.
  // add it here so that it only resolves the first time, despite route changes.
  // useLayoutEffect because it has to be executed before the sideNavigation component requests them
  useLayoutEffect(() => {
    if (sidebarOpen && isPersonalized && subscriptions && !resolvedSubscriptions) {
      setResolvedSubscriptions(true);
      resolveUris(subscriptions.map((sub) => sub.uri));
    }
  }, [sidebarOpen, isPersonalized, resolvedSubscriptions, subscriptions, resolveUris, setResolvedSubscriptions]);

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
      <NotificationManager />
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
