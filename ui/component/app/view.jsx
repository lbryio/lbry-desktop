// @flow
import * as PAGES from 'constants/pages';
import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import analytics from 'analytics';
import { buildURI, parseURI, TX_LIST } from 'lbry-redux';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import { openContextMenu } from 'util/context-menu';
import useKonamiListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';
import FloatingViewer from 'component/floatingViewer';
import { withRouter } from 'react-router';
import usePrevious from 'effects/use-previous';
import Nag from 'component/common/nag';
import { rewards as REWARDS } from 'lbryinc';
// @if TARGET='web'
import OpenInAppLink from 'component/openInAppLink';
import YoutubeWelcome from 'component/youtubeWelcome';
// @endif

export const MAIN_WRAPPER_CLASS = 'main-wrapper';
// @if TARGET='app'
export const IS_MAC = process.platform === 'darwin';
// @endif
const SYNC_INTERVAL = 1000 * 60 * 5; // 5 minutes

type Props = {
  alertError: (string | {}) => void,
  pageTitle: ?string,
  language: string,
  languages: Array<string>,
  theme: string,
  user: ?{ id: string, has_verified_email: boolean, is_reward_approved: boolean },
  location: { pathname: string, hash: string, search: string },
  history: { push: string => void },
  fetchRewards: () => void,
  fetchTransactions: (number, number) => void,
  fetchAccessToken: () => void,
  fetchChannelListMine: () => void,
  signIn: () => void,
  requestDownloadUpgrade: () => void,
  onSignedIn: () => void,
  setLanguage: string => void,
  isUpgradeAvailable: boolean,
  autoUpdateDownloaded: boolean,
  checkSync: () => void,
  updatePreferences: () => void,
  syncEnabled: boolean,
  uploadCount: number,
  balance: ?number,
  syncError: ?string,
  rewards: Array<Reward>,
  setReferrer: (string, boolean) => void,
};

function App(props: Props) {
  const {
    theme,
    fetchRewards,
    fetchTransactions,
    user,
    fetchAccessToken,
    fetchChannelListMine,
    signIn,
    autoUpdateDownloaded,
    isUpgradeAvailable,
    requestDownloadUpgrade,
    syncEnabled,
    checkSync,
    uploadCount,
    history,
    syncError,
    language,
    languages,
    setLanguage,
    updatePreferences,
    rewards,
    setReferrer,
  } = props;

  const appRef = useRef();
  const isEnhancedLayout = useKonamiListener();
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const userId = user && user.id;
  const hasVerifiedEmail = user && user.has_verified_email;
  const isRewardApproved = user && user.is_reward_approved;
  const previousUserId = usePrevious(userId);
  const previousHasVerifiedEmail = usePrevious(hasVerifiedEmail);
  const previousRewardApproved = usePrevious(isRewardApproved);
  const { pathname, hash, search } = props.location;
  const showUpgradeButton = autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);
  // referral claiming
  const referredRewardAvailable = rewards && rewards.some(reward => reward.reward_type === REWARDS.TYPE_REFEREE);
  const urlParams = new URLSearchParams(search);
  const rawReferrerParam = urlParams.get('r');
  const sanitizedReferrerParam = rawReferrerParam && rawReferrerParam.replace(':', '#');
  const wrapperElement = appRef.current;

  let uri;
  try {
    const newpath = buildURI(parseURI(pathname.slice(1).replace(/:/g, '#')));
    uri = newpath + hash;
  } catch (e) {}

  useEffect(() => {
    if (!uploadCount) return;
    const handleBeforeUnload = event => {
      event.preventDefault();
      event.returnValue = 'magic'; // without setting this to something it doesn't work
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [uploadCount]);

  useEffect(() => {
    if (referredRewardAvailable && sanitizedReferrerParam && isRewardApproved) {
      setReferrer(sanitizedReferrerParam, true);
    } else if (referredRewardAvailable && sanitizedReferrerParam) {
      setReferrer(sanitizedReferrerParam, false);
    }
  }, [sanitizedReferrerParam, isRewardApproved, referredRewardAvailable]);

  useEffect(() => {
    if (wrapperElement) {
      ReactModal.setAppElement(wrapperElement);
    }
    fetchAccessToken();

    // @if TARGET='app'
    fetchRewards();
    fetchTransactions(1, TX_LIST.LATEST_PAGE_SIZE);
    fetchChannelListMine(); // This needs to be done for web too...
    // @endif
  }, [fetchRewards, fetchTransactions, fetchAccessToken, fetchChannelListMine, wrapperElement]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!languages.includes(language)) {
      setLanguage(language);
    }
  }, [language, languages]);

  useEffect(() => {
    if (previousUserId === undefined && userId) {
      analytics.setUser(userId);
    }
  }, [previousUserId, userId]);

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

  // Keep this at the end to ensure initial setup effects are run first
  useEffect(() => {
    // Wait for balance to be populated on desktop so we know when we can begin syncing
    if (!hasSignedIn && hasVerifiedEmail) {
      signIn();
      setHasSignedIn(true);
    }
  }, [hasVerifiedEmail, signIn, hasSignedIn]);

  // @if TARGET='app'
  useEffect(() => {
    updatePreferences();
  }, []);
  // @endif

  useEffect(() => {
    if (hasVerifiedEmail && syncEnabled) {
      checkSync();

      let syncInterval = setInterval(() => {
        checkSync();
      }, SYNC_INTERVAL);

      return () => {
        clearInterval(syncInterval);
      };
    }
  }, [hasVerifiedEmail, syncEnabled, checkSync]);

  useEffect(() => {
    if (syncError) {
      history.push(`/$/${PAGES.AUTH}?redirect=${pathname}`);
    }
  }, [syncError, pathname]);

  // @if TARGET='web'
  // Require an internal-api user on lbry.tv
  // This also prevents the site from loading in the un-authed state while we wait for internal-apis to return for the first time
  // It's not needed on desktop since there is no un-authed state
  if (!user) {
    return null;
  }
  // @endif

  return (
    <div
      className={classnames(MAIN_WRAPPER_CLASS, {
        // @if TARGET='app'
        [`${MAIN_WRAPPER_CLASS}--mac`]: IS_MAC,
        // @endif
      })}
      ref={appRef}
      onContextMenu={IS_WEB ? undefined : e => openContextMenu(e)}
    >
      <Router />
      <ModalRouter />
      <FloatingViewer pageUri={uri} />

      {/* @if TARGET='web' */}
      <YoutubeWelcome />
      <OpenInAppLink uri={uri} />
      {/* @endif */}

      {/* @if TARGET='app' */}
      {showUpgradeButton && (
        <Nag message={__('An upgrade is available.')} actionText={__('Install Now')} onClick={requestDownloadUpgrade} />
      )}
      {/* @endif */}
      {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}
    </div>
  );
}

export default withRouter(App);
