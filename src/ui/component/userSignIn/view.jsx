// @flow
import React from 'react';
import { withRouter } from 'react-router';
import UserEmailNew from 'component/userEmailNew';
import UserEmailVerify from 'component/userEmailVerify';
import UserFirstChannel from 'component/userFirstChannel';
import UserVerify from 'component/userVerify';
import Spinner from 'component/spinner';
import { DEFAULT_BID_FOR_FIRST_CHANNEL } from 'component/userFirstChannel/view';
import { rewards as REWARDS } from 'lbryinc';
import usePrevious from 'util/use-previous';

type Props = {
  user: ?User,
  email: ?string,
  fetchingChannels: boolean,
  channels: ?Array<string>,
  balance: ?number,
  fetchingChannels: boolean,
  claimingReward: boolean,
  claimReward: () => void,
  claimedRewards: Array<Reward>,
  history: { replace: string => void },
  location: { search: string },
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
  const { email, user, channels, claimingReward, claimReward, claimedRewards, balance, history, location } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const redirect = urlParams.get('redirect');
  const hasFetchedReward = useFetched(claimingReward);
  const hasVerifiedEmail = user && user.has_verified_email;
  const rewardsApproved = user && user.is_reward_approved;
  const channelCount = channels ? channels.length : 0;
  const hasFetchedChannels = channels !== undefined;
  const hasClaimedEmailAward = claimedRewards.some(reward => reward.reward_type === REWARDS.TYPE_CONFIRM_EMAIL);
  const memoizedClaimReward = React.useCallback(() => {
    claimReward();
  }, [claimReward]);

  React.useEffect(() => {
    if (hasVerifiedEmail && balance !== undefined && !hasClaimedEmailAward && !hasFetchedReward) {
      memoizedClaimReward();
    }
  }, [hasVerifiedEmail, memoizedClaimReward, balance, hasClaimedEmailAward, hasFetchedReward]);

  if (
    !user ||
    (balance === 0 && !hasFetchedReward) ||
    (hasVerifiedEmail && balance === undefined) ||
    (hasVerifiedEmail && !hasFetchedChannels)
  ) {
    return (
      <div className="main--empty">
        <Spinner delayed />
      </div>
    );
  }

  if (balance === 0 && hasClaimedEmailAward) {
    history.replace(redirect || '/');
  }

  if (rewardsApproved && channelCount > 0) {
    history.replace(redirect || '/');
  }

  if (rewardsApproved && hasFetchedReward && balance && (balance === 0 || balance < DEFAULT_BID_FOR_FIRST_CHANNEL)) {
    history.replace(redirect || '/');
  }

  return (
    <section>
      {hasVerifiedEmail && !rewardsApproved ? (
        <UserVerify />
      ) : (
        <div className="main--contained">
          {!email && !hasVerifiedEmail && <UserEmailNew />}
          {email && !hasVerifiedEmail && <UserEmailVerify />}
          {hasVerifiedEmail && balance && balance > 0 && channelCount === 0 && <UserFirstChannel />}
        </div>
      )}
    </section>
  );
}

export default withRouter(UserSignIn);
