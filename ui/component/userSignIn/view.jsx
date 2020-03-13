// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import { withRouter } from 'react-router';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';
import UserFirstChannel from 'component/userFirstChannel';
import UserChannelFollowIntro from 'component/userChannelFollowIntro';
import { DEFAULT_BID_FOR_FIRST_CHANNEL } from 'component/userFirstChannel/view';
import { rewards as REWARDS, YOUTUBE_STATUSES } from 'lbryinc';
import UserVerify from 'component/userVerify';
import Spinner from 'component/spinner';
import YoutubeTransferStatus from 'component/youtubeTransferStatus';
import SyncPassword from 'component/syncPassword';
import useFetched from 'effects/use-fetched';
import usePersistedState from 'effects/use-persisted-state';
import Confetti from 'react-confetti';

type Props = {
  user: ?User,
  emailToVerify: ?string,
  channels: ?Array<string>,
  balance: ?number,
  fetchingChannels: boolean,
  claimingReward: boolean,
  claimReward: () => void,
  fetchUser: () => void,
  claimedRewards: Array<Reward>,
  history: { replace: string => void },
  location: { search: string },
  youtubeChannels: Array<any>,
  syncEnabled: boolean,
  hasSynced: boolean,
  syncingWallet: boolean,
  getSyncError: ?string,
  creatingChannel: boolean,
};

function UserSignIn(props: Props) {
  const {
    emailToVerify,
    user,
    claimingReward,
    claimedRewards,
    channels,
    claimReward,
    balance,
    history,
    location,
    fetchUser,
    youtubeChannels,
    syncEnabled,
    syncingWallet,
    getSyncError,
    hasSynced,
    fetchingChannels,
    creatingChannel,
  } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const shouldRedirectImmediately = urlParams.get('immediate');
  const [initialSignInStep, setInitialSignInStep] = React.useState();
  const [hasSeenFollowList, setHasSeenFollowList] = usePersistedState('channel-follow-intro', false);
  const hasVerifiedEmail = user && user.has_verified_email;
  const rewardsApproved = user && user.is_reward_approved;
  const isIdentityVerified = user && user.is_identity_verified;
  const hasFetchedReward = useFetched(claimingReward);
  const channelCount = channels ? channels.length : 0;
  const hasClaimedEmailAward = claimedRewards.some(reward => reward.reward_type === REWARDS.TYPE_CONFIRM_EMAIL);
  const hasYoutubeChannels = youtubeChannels && Boolean(youtubeChannels.length);
  const isYoutubeTransferComplete =
    hasYoutubeChannels &&
    youtubeChannels.every(channel => channel.transfer_state === YOUTUBE_STATUSES.COMPLETED_TRANSFER);

  // Complexity warning
  // We can't just check if we are currently fetching something
  // We may want to keep a component rendered while something is being fetched, instead of replacing it with the large spinner
  // The verbose variable names are an attempt to alleviate _some_ of the confusion from handling all edge cases that come from
  // reward claiming, channel creation, account syncing, and youtube transfer
  // The possible screens for the sign in flow
  const showEmail = !emailToVerify && !hasVerifiedEmail;
  const showEmailVerification = emailToVerify && !hasVerifiedEmail;
  const showUserVerification = hasVerifiedEmail && !rewardsApproved && !isIdentityVerified;
  const showSyncPassword = syncEnabled && getSyncError;
  const showChannelCreation =
    hasVerifiedEmail &&
    balance !== undefined &&
    balance !== null &&
    balance > DEFAULT_BID_FOR_FIRST_CHANNEL &&
    channelCount === 0 &&
    !hasYoutubeChannels;
  const showYoutubeTransfer = hasVerifiedEmail && hasYoutubeChannels && !isYoutubeTransferComplete;
  const showFollowIntro = hasVerifiedEmail && !hasSeenFollowList;
  const canHijackSignInFlowWithSpinner = hasVerifiedEmail && !getSyncError && !showFollowIntro;
  const isCurrentlyFetchingSomething = fetchingChannels || claimingReward || syncingWallet || creatingChannel;
  const isWaitingForSomethingToFinish =
    // If the user has claimed the email award, we need to wait until the balance updates sometime in the future
    (!hasFetchedReward && !hasClaimedEmailAward) || (syncEnabled && !hasSynced);
  const showLoadingSpinner =
    canHijackSignInFlowWithSpinner && (isCurrentlyFetchingSomething || isWaitingForSomethingToFinish);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  React.useEffect(() => {
    // Don't claim the reward if sync is enabled until after a sync has been completed successfully
    // If we do it before, we could end up trying to sync a wallet with a non-zero balance which will fail to sync
    const delayForSync = syncEnabled && !hasSynced;

    if (hasVerifiedEmail && !hasClaimedEmailAward && !hasFetchedReward && !delayForSync) {
      claimReward();
    }
  }, [hasVerifiedEmail, claimReward, hasClaimedEmailAward, hasFetchedReward, syncEnabled, hasSynced, balance]);

  // Loop through this list from the end, until it finds a matching component
  // If it never finds one, assume the user has completed every step and redirect them
  const SIGN_IN_FLOW = [
    showEmail && <UserEmailNew />,
    showEmailVerification && <UserEmailVerify />,
    showUserVerification && <UserVerify skipLink={redirect} />,
    showChannelCreation && <UserFirstChannel />,
    showFollowIntro && (
      <UserChannelFollowIntro
        onContinue={() => {
          let url = `/$/${PAGES.AUTH}?reset_scroll=1`;
          if (redirect) {
            url += `&redirect=${redirect}`;
          }
          if (shouldRedirectImmediately) {
            url += `&immediate=true`;
          }

          history.replace(url);
          setHasSeenFollowList(true);
        }}
      />
    ),
    showYoutubeTransfer && (
      <div>
        <YoutubeTransferStatus /> <Confetti recycle={false} style={{ position: 'fixed' }} />
      </div>
    ),
    showSyncPassword && <SyncPassword />,
    showLoadingSpinner && (
      <div className="main--empty">
        <Spinner />
      </div>
    ),
  ];

  function getSignInStep() {
    for (var i = SIGN_IN_FLOW.length - 1; i > -1; i--) {
      const Component = SIGN_IN_FLOW[i];
      if (Component) {
        // If we want to redirect immediately,
        // remember the first step so we can redirect once a new step has been reached
        // Ignore the loading step
        if (redirect && shouldRedirectImmediately) {
          if (!initialSignInStep) {
            setInitialSignInStep(i);
          } else if (i !== initialSignInStep && i !== SIGN_IN_FLOW.length - 1) {
            history.replace(redirect);
          }
        }

        return Component;
      }
    }
  }

  const componentToRender = getSignInStep();

  if (!componentToRender) {
    history.replace(redirect || '/');
  }

  return <section className="main--contained">{componentToRender}</section>;
}

export default withRouter(UserSignIn);
