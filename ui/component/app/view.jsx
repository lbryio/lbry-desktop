// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect, useState } from 'react';
import { lazyImport } from 'util/lazyImport';
import { tusUnlockAndNotify, tusHandleTabUpdates } from 'util/tus';
import analytics from 'analytics';
import { setSearchUserId } from 'redux/actions/search';
import { parseURI, buildURI } from 'util/lbryURI';
import { generateGoogleCacheUrl } from 'util/url';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import useKonamiListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';
import FileRenderFloating from 'component/fileRenderFloating';
import { withRouter } from 'react-router';
import usePrevious from 'effects/use-previous';
import Nag from 'component/nag';
import REWARDS from 'rewards';
import usePersistedState from 'effects/use-persisted-state';
import useConnectionStatus from 'effects/use-connection-status';
import Spinner from 'component/spinner';
import LANGUAGES from 'constants/languages';
import { BeforeUnload, Unload } from 'util/beforeUnload';
import AdBlockTester from 'web/component/adBlockTester';
import AdsSticky from 'web/component/adsSticky';
import YoutubeWelcome from 'web/component/youtubeReferralWelcome';
import {
  useDegradedPerformance,
  STATUS_OK,
  STATUS_DEGRADED,
  STATUS_FAILING,
  STATUS_DOWN,
} from 'web/effects/use-degraded-performance';
import LANGUAGE_MIGRATIONS from 'constants/language-migrations';
import { useIsMobile } from 'effects/use-screensize';

const FileDrop = lazyImport(() => import('component/fileDrop' /* webpackChunkName: "fileDrop" */));
const NagContinueFirstRun = lazyImport(() => import('component/nagContinueFirstRun' /* webpackChunkName: "nagCFR" */));
const NagDegradedPerformance = lazyImport(() =>
  import('web/component/nag-degraded-performance' /* webpackChunkName: "NagDegradedPerformance" */)
);
const NagNoUser = lazyImport(() => import('web/component/nag-no-user' /* webpackChunkName: "nag-no-user" */));
const NagSunset = lazyImport(() => import('web/component/nag-sunset' /* webpackChunkName: "nag-sunset" */));
const SyncFatalError = lazyImport(() => import('component/syncFatalError' /* webpackChunkName: "syncFatalError" */));

// ****************************************************************************

export const MAIN_WRAPPER_CLASS = 'main-wrapper';
export const IS_MAC = navigator.userAgent.indexOf('Mac OS X') !== -1;

// const imaLibraryPath = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
const oneTrustScriptSrc = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';

const LATEST_PATH = `/$/${PAGES.LATEST}/`;
const LIVE_PATH = `/$/${PAGES.LIVE_NOW}/`;
const EMBED_PATH = `/$/${PAGES.EMBED}/`;

type Props = {
  language: string,
  languages: Array<string>,
  theme: string,
  user: ?{ id: string, has_verified_email: boolean, is_reward_approved: boolean },
  locale: ?LocaleInfo,
  location: { pathname: string, hash: string, search: string, hostname: string, reload: () => void },
  history: { push: (string) => void, location: { pathname: string }, replace: (string) => void },
  fetchChannelListMine: () => void,
  fetchCollectionListMine: () => void,
  signIn: () => void,
  setLanguage: (string) => void,
  fetchLanguage: (string) => void,
  isReloadRequired: boolean,
  uploadCount: number,
  balance: ?number,
  syncIsLocked: boolean,
  syncError: ?string,
  prefsReady: boolean,
  rewards: Array<Reward>,
  doUserSetReferrer: (referrerUri: string) => void,
  isAuthenticated: boolean,
  syncLoop: (?boolean) => void,
  currentModal: any,
  syncFatalError: boolean,
  activeChannelClaim: ?ChannelClaim,
  myChannelClaimIds: ?Array<string>,
  setIncognito: (boolean) => void,
  fetchModBlockedList: () => void,
  fetchModAmIList: () => void,
  homepageFetched: boolean,
  defaultChannelClaim: ?any,
  nagsShown: boolean,
  announcement: string,
  doOpenAnnouncements: () => void,
  doSetLastViewedAnnouncement: (hash: string) => void,
  doSetDefaultChannel: (claimId: string) => void,
  doSetGdprConsentList: (csv: string) => void,
};

function App(props: Props) {
  const {
    theme,
    user,
    locale,
    location,
    fetchChannelListMine,
    fetchCollectionListMine,
    signIn,
    isReloadRequired,
    uploadCount,
    history,
    syncError,
    syncIsLocked,
    prefsReady,
    language,
    languages,
    setLanguage,
    fetchLanguage,
    rewards,
    doUserSetReferrer,
    isAuthenticated,
    syncLoop,
    currentModal,
    syncFatalError,
    myChannelClaimIds,
    activeChannelClaim,
    setIncognito,
    fetchModBlockedList,
    fetchModAmIList,
    defaultChannelClaim,
    nagsShown,
    announcement,
    doOpenAnnouncements,
    doSetLastViewedAnnouncement,
    doSetDefaultChannel,
    doSetGdprConsentList,
  } = props;

  const isMobile = useIsMobile();
  const isEnhancedLayout = useKonamiListener();
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const hasVerifiedEmail = user && Boolean(user.has_verified_email);
  const isRewardApproved = user && user.is_reward_approved;
  const previousHasVerifiedEmail = usePrevious(hasVerifiedEmail);
  const previousRewardApproved = usePrevious(isRewardApproved);

  const [lbryTvApiStatus, setLbryTvApiStatus] = useState(STATUS_OK);
  const [sidebarOpen] = usePersistedState('sidebar', false);

  const { pathname, hash, search, hostname } = location;
  const [retryingSync, setRetryingSync] = useState(false);
  const [langRenderKey, setLangRenderKey] = useState(0);
  const [seenSunsestMessage, setSeenSunsetMessage] = usePersistedState('lbrytv-sunset', false);
  // referral claiming
  const referredRewardAvailable = rewards && rewards.some((reward) => reward.reward_type === REWARDS.TYPE_REFEREE);
  const urlParams = new URLSearchParams(search);
  const rawReferrerParam = urlParams.get('r');
  const fromLbrytvParam = urlParams.get('sunset');
  const sanitizedReferrerParam = rawReferrerParam && rawReferrerParam.replace(':', '#');
  const embedPath = pathname.startsWith(EMBED_PATH);
  const shouldHideNag = embedPath || pathname.startsWith(`/$/${PAGES.AUTH_VERIFY}`);
  const userId = user && user.id;
  const hasMyChannels = myChannelClaimIds && myChannelClaimIds.length > 0;
  const hasNoChannels = myChannelClaimIds && myChannelClaimIds.length === 0;
  const shouldMigrateLanguage = LANGUAGE_MIGRATIONS[language];
  const renderFiledrop = !isMobile && isAuthenticated;
  const connectionStatus = useConnectionStatus();

  const urlPath = pathname + hash;
  const latestContentPath = urlPath.startsWith(LATEST_PATH);
  const liveContentPath = urlPath.startsWith(LIVE_PATH);
  const featureParam = urlParams.get('feature');
  const embedLatestPath = embedPath && (featureParam === PAGES.LATEST || featureParam === PAGES.LIVE_NOW);
  const isNewestPath = latestContentPath || liveContentPath || embedLatestPath;

  let path;
  if (isNewestPath) {
    path = urlPath.replace(embedLatestPath ? EMBED_PATH : latestContentPath ? LATEST_PATH : LIVE_PATH, '');
  } else {
    // Remove the leading "/" added by the browser
    path = urlPath.slice(1);
  }
  path = path.replace(/:/g, '#');

  if (isNewestPath && !path.startsWith('@')) {
    path = `@${path}`;
  }

  if (search && search.startsWith('?q=cache:')) {
    generateGoogleCacheUrl(search, path);
  }

  let uri;
  try {
    // here queryString and startTime are "removed" from the buildURI process
    // to build only the uri itself
    const { queryString, startTime, ...parsedUri } = parseURI(path);
    uri = buildURI({ ...parsedUri });
  } catch (e) {
    const match = path.match(/[#/:]/);

    if (!path.startsWith('$/') && match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
    }
  }

  function getStatusNag() {
    // Handle "offline" first. Everything else is meaningless if it's offline.
    if (!connectionStatus.online) {
      return <Nag type="helpful" message={__('You are offline. Check your internet connection.')} />;
    }

    // Only 1 nag is possible, so show the most important:

    if (user === null) {
      return <NagNoUser />;
    }

    if (lbryTvApiStatus === STATUS_DEGRADED || lbryTvApiStatus === STATUS_FAILING) {
      if (!shouldHideNag) {
        return <NagDegradedPerformance onClose={() => setLbryTvApiStatus(STATUS_OK)} />;
      }
    }

    if (syncFatalError) {
      if (!retryingSync) {
        return (
          <Nag
            type="error"
            message={__('Failed to synchronize settings. Wait a while before retrying.')}
            actionText={__('Retry')}
            onClick={() => {
              syncLoop(true);
              setRetryingSync(true);
              setTimeout(() => setRetryingSync(false), 4000);
            }}
          />
        );
      }
    } else if (isReloadRequired) {
      return (
        <Nag
          message={__('A new version of Odysee is available.')}
          actionText={__('Refresh')}
          onClick={() => window.location.reload()}
        />
      );
    }
  }

  useEffect(() => {
    if (userId) {
      analytics.setUser(userId);
      setSearchUserId(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (syncIsLocked) {
      const msg = 'There are unsaved settings. Exit the Settings Page to finalize them.';
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = msg;
      };

      BeforeUnload.register(handleBeforeUnload, msg);
      return () => BeforeUnload.unregister(handleBeforeUnload);
    }
  }, [syncIsLocked]);

  useEffect(() => {
    if (!uploadCount) return;

    const msg = 'Unfinished uploads.';
    const handleUnload = (event) => tusUnlockAndNotify();
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = __(msg); // without setting this to something it doesn't work in some browsers.
    };

    Unload.register(handleUnload);
    BeforeUnload.register(handleBeforeUnload, msg);

    return () => {
      Unload.unregister(handleUnload);
      BeforeUnload.unregister(handleBeforeUnload);
    };
  }, [uploadCount]);

  useEffect(() => {
    if (!uploadCount) return;

    const onStorageUpdate = (e) => tusHandleTabUpdates(e.key);
    window.addEventListener('storage', onStorageUpdate);

    return () => window.removeEventListener('storage', onStorageUpdate);
  }, [uploadCount]);

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

  useEffect(() => {
    if (referredRewardAvailable && sanitizedReferrerParam) {
      doUserSetReferrer(sanitizedReferrerParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedReferrerParam, referredRewardAvailable]);

  useEffect(() => {
    // @if TARGET='app'
    fetchChannelListMine(); // This is fetched after a user is signed in on web
    fetchCollectionListMine();
    // @endif
  }, [fetchChannelListMine, fetchCollectionListMine]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  useEffect(() => {
    // $FlowFixMe
    document.body.style.overflowY = currentModal ? 'hidden' : '';
  }, [currentModal]);

  useEffect(() => {
    if (hasNoChannels) {
      setIncognito(true);
    }

    if (hasMyChannels) {
      fetchModBlockedList();
      fetchModAmIList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMyChannels, hasNoChannels, setIncognito]);

  useEffect(() => {
    if (hasMyChannels && activeChannelClaim && !defaultChannelClaim && prefsReady) {
      doSetDefaultChannel(activeChannelClaim.claim_id);
    }
  }, [activeChannelClaim, defaultChannelClaim, doSetDefaultChannel, hasMyChannels, prefsReady]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    if (!languages.includes(language)) {
      fetchLanguage(language);

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
      analytics.event.emailVerified();
    }
  }, [previousHasVerifiedEmail, hasVerifiedEmail, signIn]);

  useEffect(() => {
    if (previousRewardApproved === false && isRewardApproved) {
      analytics.event.rewardEligible();
    }
  }, [previousRewardApproved, isRewardApproved]);

  // Load IMA3 SDK for aniview
  // useEffect(() => {
  //   if (!isAuthenticated && SHOW_ADS) {
  //     const script = document.createElement('script');
  //     script.src = imaLibraryPath;
  //     script.async = true;
  //     // $FlowFixMe
  //     document.body.appendChild(script);
  //     return () => {
  //       // $FlowFixMe
  //       document.body.removeChild(script);
  //     };
  //   }
  // }, []);

  // add OneTrust script
  useEffect(() => {
    // don't add script for embedded content
    function inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }

    if (inIframe() || !locale || !locale.gdpr_required) {
      const ad = document.getElementsByClassName('OUTBRAIN')[0];
      if (ad) {
        if (!nagsShown) ad.classList.add('VISIBLE');
        if (!sidebarOpen || isMobile) ad.classList.add('LEFT');
      }
      return;
    }

    // $FlowFixMe
    const useProductionOneTrust = process.env.NODE_ENV === 'production' && hostname === 'odysee.com';

    const script = document.createElement('script');
    script.src = oneTrustScriptSrc;
    script.setAttribute('charset', 'UTF-8');
    if (useProductionOneTrust) {
      script.setAttribute('data-domain-script', '8a792d84-50a5-4b69-b080-6954ad4d4606');
    } else {
      script.setAttribute('data-domain-script', '8a792d84-50a5-4b69-b080-6954ad4d4606-test');
    }

    const secondScript = document.createElement('script');
    // OneTrust asks to add this
    secondScript.innerHTML = 'function OptanonWrapper() { window.gdprCallback() }';

    window.gdprCallback = () => {
      doSetGdprConsentList(window.OnetrustActiveGroups);
      if (window.OnetrustActiveGroups.indexOf('C0002') !== -1) {
        const ad = document.getElementsByClassName('OUTBRAIN')[0];
        if (ad && !window.nagsShown) ad.classList.add('VISIBLE');
      }
    };

    // $FlowFixMe
    document.head.appendChild(script);
    // $FlowFixMe
    document.head.appendChild(secondScript);

    return () => {
      try {
        // $FlowFixMe
        document.head.removeChild(script);
        // $FlowFixMe
        document.head.removeChild(secondScript);
      } catch (err) {
        // eslint-disable-next-line no-console
        // console.log(err); <-- disabling this ... it's clogging up Sentry logs.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one time after locale is fetched
  }, [locale]);

  useEffect(() => {
    window.nagsShown = nagsShown;
    if (nagsShown) {
      const ad = document.getElementsByClassName('VISIBLE')[0];
      if (ad) ad.classList.remove('VISIBLE');
    } else {
      const ad = document.getElementsByClassName('OUTBRAIN')[0];
      if (ad) ad.classList.add('VISIBLE');
    }
  }, [nagsShown]);

  // ready for sync syncs, however after signin when hasVerifiedEmail, that syncs too.
  useEffect(() => {
    // signInSyncPref is cleared after sharedState loop.
    const syncLoopWithoutInterval = () => syncLoop(true);
    if (hasSignedIn && hasVerifiedEmail) {
      // In case we are syncing.
      syncLoop();
      window.addEventListener('focus', syncLoopWithoutInterval);
    }
    return () => {
      window.removeEventListener('focus', syncLoopWithoutInterval);
    };
  }, [hasSignedIn, hasVerifiedEmail, syncLoop]);

  useEffect(() => {
    if (syncError && isAuthenticated && !pathname.includes(PAGES.AUTH_WALLET_PASSWORD) && !currentModal) {
      history.push(`/$/${PAGES.AUTH_WALLET_PASSWORD}?redirect=${pathname}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncError, pathname, isAuthenticated]);

  useEffect(() => {
    if (prefsReady && isAuthenticated && (pathname === '/' || pathname === `/$/${PAGES.HELP}`) && announcement !== '') {
      doOpenAnnouncements();
    }
  }, [announcement, isAuthenticated, pathname, prefsReady]);

  useEffect(() => {
    window.clearLastViewedAnnouncement = () => {
      console.log('Clearing history. Please wait ...'); // eslint-disable-line no-console
      doSetLastViewedAnnouncement('clear');
    };
  }, []);

  // Keep this at the end to ensure initial setup effects are run first
  useEffect(() => {
    if (!hasSignedIn && hasVerifiedEmail) {
      signIn();
      setHasSignedIn(true);
    }
  }, [hasVerifiedEmail, signIn, hasSignedIn]);

  useDegradedPerformance(setLbryTvApiStatus, user);

  useEffect(() => {
    if (!syncIsLocked) {
      // When language is changed or translations are fetched, we render.
      setLangRenderKey(Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- don't respond to syncIsLocked, but skip action when locked.
  }, [language, languages]);

  const appRef = React.useCallback((wrapperElement) => {
    if (wrapperElement) {
      ReactModal.setAppElement(wrapperElement);
    }
  }, []);

  // Require an internal-api user on lbry.tv
  // This also prevents the site from loading in the un-authed state while we wait for internal-apis to return for the first time
  // It's not needed on desktop since there is no un-authed state
  if (user === undefined) {
    return (
      <div className="main--empty">
        <Spinner delayed />
      </div>
    );
  }

  if (connectionStatus.online && lbryTvApiStatus === STATUS_DOWN) {
    // TODO: Rename `SyncFatalError` since it has nothing to do with syncing.
    return (
      <React.Suspense fallback={null}>
        <SyncFatalError lbryTvApiStatus={lbryTvApiStatus} />
      </React.Suspense>
    );
  }

  return (
    <div className={MAIN_WRAPPER_CLASS} ref={appRef} key={langRenderKey}>
      {lbryTvApiStatus === STATUS_DOWN ? (
        <Yrbl
          className="main--empty"
          title={__('odysee.com is currently down')}
          subtitle={__('My wheel broke, but the good news is that someone from LBRY is working on it.')}
        />
      ) : (
        <React.Fragment>
          <AdBlockTester />
          <AdsSticky uri={uri} />
          <Router uri={uri} />
          <ModalRouter />

          <React.Suspense fallback={null}>{renderFiledrop && <FileDrop />}</React.Suspense>

          <FileRenderFloating />

          <React.Suspense fallback={null}>
            {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}

            <YoutubeWelcome />
            {!shouldHideNag && <NagContinueFirstRun />}
            {fromLbrytvParam && !seenSunsestMessage && !shouldHideNag && (
              <NagSunset email={hasVerifiedEmail} onClose={() => setSeenSunsetMessage(true)} />
            )}
            {getStatusNag()}
          </React.Suspense>
        </React.Fragment>
      )}
    </div>
  );
}

export default withRouter(App);
