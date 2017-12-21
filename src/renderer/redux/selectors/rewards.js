import { createSelector } from 'reselect';
import REWARDS from 'rewards';

const selectState = state => state.rewards || {};

export const selectUnclaimedRewardsByType = createSelector(
  selectState,
  state => state.unclaimedRewardsByType
);

export const selectClaimedRewardsById = createSelector(
  selectState,
  state => state.claimedRewardsById
);

export const selectClaimedRewards = createSelector(
  selectClaimedRewardsById,
  byId => Object.values(byId) || []
);

export const selectClaimedRewardsByTransactionId = createSelector(selectClaimedRewards, rewards =>
  rewards.reduce((mapParam, reward) => {
    const map = mapParam;
    map[reward.transaction_id] = reward;
    return map;
  }, {})
);

export const selectUnclaimedRewards = createSelector(
  selectUnclaimedRewardsByType,
  byType =>
    Object.values(byType).sort(
      (a, b) =>
        REWARDS.SORT_ORDER.indexOf(a.reward_type) < REWARDS.SORT_ORDER.indexOf(b.reward_type)
          ? -1
          : 1
    ) || []
);

export const selectFetchingRewards = createSelector(selectState, state => !!state.fetching);

export const selectUnclaimedRewardValue = createSelector(selectUnclaimedRewards, rewards =>
  rewards.reduce((sum, reward) => sum + reward.reward_amount, 0)
);

export const selectClaimsPendingByType = createSelector(
  selectState,
  state => state.claimPendingByType
);

const selectIsClaimRewardPending = (state, props) =>
  selectClaimsPendingByType(state, props)[props.reward_type];

export const makeSelectIsRewardClaimPending = () =>
  createSelector(selectIsClaimRewardPending, isClaiming => isClaiming);

export const selectClaimErrorsByType = createSelector(
  selectState,
  state => state.claimErrorsByType
);

const selectClaimRewardError = (state, props) =>
  selectClaimErrorsByType(state, props)[props.reward_type];

export const makeSelectClaimRewardError = () =>
  createSelector(selectClaimRewardError, errorMessage => errorMessage);

const selectRewardByType = (state, props) => selectUnclaimedRewardsByType(state)[props.reward_type];

export const makeSelectRewardByType = () => createSelector(selectRewardByType, reward => reward);

export const makeSelectRewardAmountByType = () =>
  createSelector(selectRewardByType, reward => (reward ? reward.reward_amount : 0));
