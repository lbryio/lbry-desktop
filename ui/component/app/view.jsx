// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { lazyImport } from 'util/lazyImport';
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

const FileDrop = lazyImport(() => import('component/fileDrop' /* webpackChunkName: "secondary" */));
const ModalRouter = lazyImport(() => import('modal/modalRouter' /* webpackChunkName: "secondary" */));
const Nag = lazyImport(() => import('component/common/nag' /* webpackChunkName: "secondary" */));

const SyncFatalError = lazyImport(() => import('component/syncFatalError' /* webpackChunkName: "syncFatalError" */));
const Yrbl = lazyImport(() => import('component/yrbl' /* webpackChunkName: "yrbl" */));

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
  activeChannelClaim: ?ChannelClaim,
  myChannelUrls: ?Array<string>,
  subscriptions: Array<Subscription>,
  setActiveChannelIfNotSet: () => void,
  setIncognito: (boolean) => void,
  fetchModBlockedList: () => void,
  resolveUris: (Array<string>) => void,
  fetchModAmIList: () => void,
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
    myChannelUrls,
    activeChannelClaim,
    setActiveChannelIfNotSet,
    setIncognito,
    fetchModBlockedList,
    resolveUris,
    subscriptions,
    fetchModAmIList,
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
  const [sidebarOpen] = usePersistedState('sidebar', true);
  const showUpgradeButton =
    (autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable)) && !upgradeNagClosed;
  // referral claiming
  const referredRewardAvailable = rewards && rewards.some((reward) => reward.reward_type === REWARDS.TYPE_REFEREE);
  const urlParams = new URLSearchParams(search);
  const rawReferrerParam = urlParams.get('r');
  const sanitizedReferrerParam = rawReferrerParam && rawReferrerParam.replace(':', '#');
  const userId = user && user.id;
  const useCustomScrollbar = !IS_MAC;
  const hasMyChannels = myChannelUrls && myChannelUrls.length > 0;
  const hasNoChannels = myChannelUrls && myChannelUrls.length === 0;
  const shouldMigrateLanguage = LANGUAGE_MIGRATIONS[language];
  const hasActiveChannelClaim = activeChannelClaim !== undefined;
  const isPersonalized = hasVerifiedEmail;
  const renderFiledrop = isAuthenticated;

  useEffect(() => {
    if (userId) {
      analytics.setUser(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!uploadCount) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = 'magic'; // without setting this to something it doesn't work
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

  // @if TARGET='app'
  useEffect(() => {
    if (updatePreferences && getWalletSyncPref && readyForPrefs) {
      getWalletSyncPref()
        .then(() => updatePreferences())
        .then(() => {
          setReadyForSync(true);
        });
    }
  }, [updatePreferences, getWalletSyncPref, setReadyForSync, readyForPrefs, hasVerifiedEmail]);
  // @endif

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
      if (IS_WEB) setReadyForSync(true);
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

  if (syncFatalError) {
    return (
      <React.Suspense fallback={null}>
        <SyncFatalError />
      </React.Suspense>
    );
  }

  return (
    <div
      className={classnames(MAIN_WRAPPER_CLASS, {
        // @if TARGET='app'
        [`${MAIN_WRAPPER_CLASS}--mac`]: IS_MAC,
        // @endif
        [`${MAIN_WRAPPER_CLASS}--scrollbar`]: useCustomScrollbar,
      })}
      ref={appRef}
      onContextMenu={IS_WEB ? undefined : (e) => openContextMenu(e)}
    >
      <Router />
      <React.Suspense fallback={null}>
        <ModalRouter />
        {renderFiledrop && <FileDrop />}
      </React.Suspense>
      <FileRenderFloating />
      <React.Suspense fallback={null}>
        {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}

        {/* @if TARGET='app' */}
        {showUpgradeButton && (
          <Nag
            message={__('An upgrade is available.')}
            actionText={__('Install Now')}
            onClick={requestDownloadUpgrade}
            onClose={() => setUpgradeNagClosed(true)}
          />
        )}
        {/* @endif */}
      </React.Suspense>
    </div>
  );
}

export default withRouter(App);
