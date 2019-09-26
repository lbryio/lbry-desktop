// @flow
import React from 'react';
import { withRouter } from 'react-router';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';
import UserFirstChannel from 'component/userFirstChannel';
import { DEFAULT_BID_FOR_FIRST_CHANNEL } from 'component/userFirstChannel/view';
import { rewards as REWARDS } from 'lbryinc';
import usePrevious from 'util/use-previous';
import UserVerify from 'component/userVerify';
import Spinner from 'component/spinner';
import YoutubeTransferWelcome from 'component/youtubeTransferWelcome';
import SyncPassword from 'component/syncPassword';

/*
  - Brand new user
  - Brand new user, not auto approved
  - Second device (first time user), first device has a password + rewards not approved
  - Second device (first time user), first device has a password + rewards approved

*/

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
  syncIsPending: boolean,
  getSyncError: ?string,
  hasSyncedSuccessfully: boolean,
};

function useFetched(fetching) {
  const wasFetching = usePrevious(fetching);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (wasFetching && !fetching) {
      setFetched(true);
    }
  }, [wasFetching, fetching, setFetched]);

  return fetched;
}

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
    syncIsPending,
    getSyncError,
    syncHash,
    fetchingChannels,
  } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const hasVerifiedEmail = user && user.has_verified_email;
  const rewardsApproved = user && user.is_reward_approved;
  const hasFetchedReward = useFetched(claimingReward);
  // const hasFetchedSync = useFetched(syncIsPending);
  // const hasTriedSyncForReal = syncEnabled && hasFetchedSync;
  const channelCount = channels ? channels.length : 0;
  const hasClaimedEmailAward = claimedRewards.some(reward => reward.reward_type === REWARDS.TYPE_CONFIRM_EMAIL);
  const hasYoutubeChannels = youtubeChannels && youtubeChannels.length;
  const hasTransferrableYoutubeChannels = hasYoutubeChannels && youtubeChannels.some(channel => channel.transferable);
  const hasPendingYoutubeTransfer =
    hasYoutubeChannels && youtubeChannels.some(channel => channel.transfer_state === 'pending_transfer');

  React.useEffect(() => {
    if (
      hasVerifiedEmail &&
      balance !== undefined &&
      !hasClaimedEmailAward &&
      !hasFetchedReward &&
      (!syncEnabled || (syncEnabled && syncHash))
    ) {
      claimReward();
    }
  }, [hasVerifiedEmail, claimReward, balance, hasClaimedEmailAward, hasFetchedReward, syncEnabled, syncHash]);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const SIGN_IN_FLOW = [
    !emailToVerify && !hasVerifiedEmail && <UserEmailNew />,
    emailToVerify && !hasVerifiedEmail && <UserEmailVerify />,
    hasVerifiedEmail && !rewardsApproved && <UserVerify />,
    getSyncError && !syncHash && <SyncPassword />,
    hasVerifiedEmail && balance > DEFAULT_BID_FOR_FIRST_CHANNEL && channelCount === 0 && !hasYoutubeChannels && (
      <UserFirstChannel />
    ),
    hasVerifiedEmail && hasYoutubeChannels && (hasTransferrableYoutubeChannels || hasPendingYoutubeTransfer) && (
      <YoutubeTransferWelcome />
    ),
    hasVerifiedEmail &&
      balance === 0 &&
      !getSyncError &&
      (fetchingChannels ||
        !hasFetchedReward ||
        claimingReward ||
        syncIsPending ||
        (syncEnabled && !syncHash) ||
        // Just claimed the email award, wait until the balance updates to move forward
        (balance === 0 && hasFetchedReward && hasClaimedEmailAward)) && (
        <div className="main--empty">
          <Spinner />
        </div>
      ),
  ];

  let componentToRender;
  for (var i = SIGN_IN_FLOW.length - 1; i > -1; i--) {
    const Component = SIGN_IN_FLOW[i];
    if (Component) {
      componentToRender = Component;
      break;
    }
  }

  if (!componentToRender) {
    history.replace(redirect || '/');
  }

  return <section className="main--contained">{componentToRender}</section>;
}

export default withRouter(UserSignIn);
