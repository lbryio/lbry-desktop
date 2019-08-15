// @flow
import React, { useEffect, useRef } from 'react';
import analytics from 'analytics';
import { Lbry, buildURI } from 'lbry-redux';
import Router from 'component/router/index';
import ModalRouter from 'modal/modalRouter';
import ReactModal from 'react-modal';
import SideBar from 'component/sideBar';
import Header from 'component/header';
import { openContextMenu } from 'util/context-menu';
import useKonamiListener from 'util/enhanced-layout';
import Yrbl from 'component/yrbl';
import FileViewer from 'component/fileViewer';
import { withRouter } from 'react-router';
import usePrevious from 'util/use-previous';

export const MAIN_WRAPPER_CLASS = 'main-wrapper';

type Props = {
  alertError: (string | {}) => void,
  pageTitle: ?string,
  language: string,
  theme: string,
  accessToken: ?string,
  user: ?{ id: string, has_verified_email: boolean, is_reward_approved: boolean },
  location: { pathname: string },
  fetchRewards: () => void,
  fetchRewardedContent: () => void,
  fetchTransactions: () => void,
  fetchAccessToken: () => void,
};

function App(props: Props) {
  const { theme, fetchRewards, fetchRewardedContent, fetchTransactions, user, fetchAccessToken, accessToken } = props;
  const appRef = useRef();
  const isEnhancedLayout = useKonamiListener();
  const userId = user && user.id;
  const hasVerifiedEmail = user && user.has_verified_email;
  const isRewardApproved = user && user.is_reward_approved;
  const previousUserId = usePrevious(userId);
  const previousHasVerifiedEmail = usePrevious(hasVerifiedEmail);
  const previousRewardApproved = usePrevious(isRewardApproved);
  const { pathname } = props.location;
  const urlParts = pathname.split('/');
  const claimName = urlParts[1];
  const claimId = urlParts[2];

  // @routingfixme
  // claimName and claimId come from the url `{domain}/{claimName}/{claimId}"
  let uri;
  try {
    uri = buildURI({ contentName: claimName, claimId: claimId });
  } catch (e) {}

  useEffect(() => {
    ReactModal.setAppElement(appRef.current);
    fetchAccessToken();
    fetchRewardedContent();

    // @if TARGET='app'
    fetchRewards();
    fetchTransactions();
    // @endif
  }, [fetchRewards, fetchRewardedContent, fetchTransactions, fetchAccessToken]);

  useEffect(() => {
    // $FlowFixMe
    document.documentElement.setAttribute('data-mode', theme);
  }, [theme]);

  useEffect(() => {
    if (previousUserId === undefined && userId) {
      analytics.setUser(userId);
    }
  }, [previousUserId, userId]);

  useEffect(() => {
    // Check that previousHasVerifiedEmail was not undefined instead of just not truthy
    // This ensures we don't fire the emailVerified event on the initial user fetch
    if (previousHasVerifiedEmail !== undefined && hasVerifiedEmail) {
      analytics.emailVerifiedEvent();
    }
  }, [previousHasVerifiedEmail, hasVerifiedEmail]);

  useEffect(() => {
    if (previousRewardApproved !== undefined && isRewardApproved) {
      analytics.rewardEligibleEvent();
    }
  }, [previousRewardApproved, isRewardApproved]);

  // @if TARGET='web'
  useEffect(() => {
    if (hasVerifiedEmail && accessToken) {
      Lbry.setApiHeader('X-Lbry-Auth-Token', accessToken);
    }
  }, [hasVerifiedEmail, accessToken]);
  // @endif

  return (
    <div className={MAIN_WRAPPER_CLASS} ref={appRef} onContextMenu={e => openContextMenu(e)}>
      <Header />

      <div className="main-wrapper__inner">
        <Router />
        <SideBar />
      </div>

      <ModalRouter />
      <FileViewer pageUri={uri} />

      {isEnhancedLayout && <Yrbl className="yrbl--enhanced" />}
    </div>
  );
}

export default withRouter(App);
