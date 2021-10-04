import { createSelector } from 'reselect';
import REWARDS from 'rewards';

const selectState = (state) => state.rewards || {};

export const selectUnclaimedRewardsByType = createSelector(selectState, (state) => state.unclaimedRewardsByType);

export const selectClaimedRewardsById = createSelector(selectState, (state) => state.claimedRewardsById);

export const selectClaimedRewards = createSelector(selectClaimedRewardsById, (byId) => Object.values(byId) || []);

export const selectClaimedRewardsByTransactionId = createSelector(selectClaimedRewards, (rewards) =>
  rewards.reduce((mapParam, reward) => {
    const map = mapParam;
    map[reward.transaction_id] = reward;
    return map;
  }, {})
);

export const selectUnclaimedRewards = createSelector(selectState, (state) => state.unclaimedRewards);

export const selectFetchingRewards = createSelector(selectState, (state) => !!state.fetching);

export const selectUnclaimedRewardValue = createSelector(selectUnclaimedRewards, (rewards) =>
  rewards.reduce((sum, reward) => sum + reward.reward_amount, 0)
);

export const selectClaimsPendingByType = createSelector(selectState, (state) => state.claimPendingByType);

const selectIsClaimRewardPending = (state, props) => selectClaimsPendingByType(state, props)[props.reward_type];

export const makeSelectIsRewardClaimPending = () =>
  createSelector(selectIsClaimRewardPending, (isClaiming) => isClaiming);

export const selectClaimErrorsByType = createSelector(selectState, (state) => state.claimErrorsByType);

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
