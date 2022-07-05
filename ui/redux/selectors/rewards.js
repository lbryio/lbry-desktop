import { createSelector } from 'reselect';
import REWARDS from 'rewards';
import { selectUser } from 'redux/selectors/user';

const selectState = (state) => state.rewards || {};

export const selectUnclaimedRewardsByType = (state) => selectState(state).unclaimedRewardsByType;
export const selectClaimedRewardsById = (state) => selectState(state).claimedRewardsById;

export const selectClaimedRewards = createSelector(selectClaimedRewardsById, (byId) => Object.values(byId) || []);

export const selectClaimedRewardsByTransactionId = createSelector(selectClaimedRewards, (rewards) =>
  rewards.reduce((mapParam, reward) => {
    const map = mapParam;
    map[reward.transaction_id] = reward;
    return map;
  }, {})
);

export const selectUnclaimedRewards = (state) => selectState(state).unclaimedRewards;
export const selectFetchingRewards = (state) => !!selectState(state).fetching;

export const selectUnclaimedRewardValue = createSelector(selectUnclaimedRewards, (rewards) =>
  rewards.reduce((sum, reward) => sum + reward.reward_amount, 0)
);

export const selectClaimsPendingByType = (state) => selectState(state).claimPendingByType;

const selectIsClaimRewardPending = (state, props) => selectClaimsPendingByType(state, props)[props.reward_type];

export const makeSelectIsRewardClaimPending = () =>
  createSelector(selectIsClaimRewardPending, (isClaiming) => isClaiming);

export const selectClaimErrorsByType = (state) => selectState(state).claimErrorsByType;

const selectClaimRewardError = (state, props) => selectClaimErrorsByType(state, props)[props.reward_type];

export const makeSelectClaimRewardError = () => createSelector(selectClaimRewardError, (errorMessage) => errorMessage);

const selectRewardByType = (state, rewardType) =>
  selectUnclaimedRewards(state).find((reward) => reward.reward_type === rewardType);

export const makeSelectRewardByType = () => createSelector(selectRewardByType, (reward) => reward);

const selectRewardByClaimCode = (state, claimCode) =>
  selectUnclaimedRewards(state).find((reward) => reward.claim_code === claimCode);

export const makeSelectRewardByClaimCode = () => createSelector(selectRewardByClaimCode, (reward) => reward);

export const makeSelectRewardAmountByType = () =>
  createSelector(selectRewardByType, (reward) => (reward ? reward.reward_amount : 0));

export const selectRewardContentClaimIds = createSelector(selectState, (state) => state.rewardedContentClaimIds);

export const selectReferralReward = createSelector(
  selectUnclaimedRewards,
  (unclaimedRewards) => unclaimedRewards.filter((reward) => reward.reward_type === REWARDS.TYPE_REFERRAL)[0]
);

export const selectHasUnclaimedRefereeReward = createSelector(selectUnclaimedRewards, (unclaimedRewards) =>
  unclaimedRewards.some((reward) => reward.reward_type === REWARDS.TYPE_REFEREE)
);

export const selectIsClaimingInitialRewards = createSelector(selectClaimsPendingByType, (claimsPendingByType) => {
  return !!(claimsPendingByType[REWARDS.TYPE_NEW_USER] || claimsPendingByType[REWARDS.TYPE_CONFIRM_EMAIL]);
});

export const selectHasClaimedInitialRewards = createSelector(selectClaimedRewardsById, (claimedRewardsById) => {
  const claims = Object.values(claimedRewardsById);
  const newUserClaimed = !!claims.find((claim) => claim && claim.reward_type === REWARDS.TYPE_NEW_USER);
  const confirmEmailClaimed = !!claims.find((claim) => claim && claim.reward_type === REWARDS.TYPE_CONFIRM_EMAIL);
  return newUserClaimed && confirmEmailClaimed;
});

export const selectWeeklyWatchClaimedThisWeek = createSelector(selectUnclaimedRewards, (unclaimedRewards) => {
  const weeklyWatch = unclaimedRewards.find((x) => x.reward_type === REWARDS.TYPE_WEEKLY_WATCH);
  if (weeklyWatch && weeklyWatch.data && weeklyWatch.data.last_claimed) {
    const last = new Date(weeklyWatch.data.last_claimed);
    const diff = new Date() - last;
    const diffDays = diff / (1000 * 60 * 60 * 24);
    return diffDays < 6.5;
  }
  return false;
});

export const selectIsRewardApproved = createSelector(selectUser, (user) => user && user.is_reward_approved);
