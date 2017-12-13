import { createSelector } from "reselect";
import { selectUser } from "redux/selectors/user";
import rewards from "rewards";

const _selectState = state => state.rewards || {};

export const selectUnclaimedRewardsByType = createSelector(
  _selectState,
  state => state.unclaimedRewardsByType
);

export const selectClaimedRewardsById = createSelector(
  _selectState,
  state => state.claimedRewardsById
);

export const selectClaimedRewards = createSelector(
  selectClaimedRewardsById,
  byId => Object.values(byId) || []
);

export const selectClaimedRewardsByTransactionId = createSelector(
  selectClaimedRewards,
  rewards =>
    rewards.reduce((map, reward) => {
      map[reward.transaction_id] = reward;
      return map;
    }, {})
);

export const selectUnclaimedRewards = createSelector(
  selectUnclaimedRewardsByType,
  byType =>
    Object.values(byType).sort(
      (a, b) =>
        rewards.SORT_ORDER.indexOf(a.reward_type) <
        rewards.SORT_ORDER.indexOf(b.reward_type)
          ? -1
          : 1
    ) || []
);

export const selectIsRewardEligible = createSelector(
  selectUser,
  user => user.can_claim_rewards
);

export const selectFetchingRewards = createSelector(
  _selectState,
  state => !!state.fetching
);

export const selectUnclaimedRewardValue = createSelector(
  selectUnclaimedRewards,
  rewards => rewards.reduce((sum, reward) => sum + reward.reward_amount, 0)
);

export const selectHasClaimedReward = (state, props) => {
  const reward = selectRewardsByType(state)[props.reward_type];
  return reward && reward.transaction_id !== "";
};

export const makeSelectHasClaimedReward = () =>
  createSelector(selectHasClaimedReward, claimed => claimed);

export const selectClaimsPendingByType = createSelector(
  _selectState,
  state => state.claimPendingByType
);

const selectIsClaimRewardPending = (state, props) =>
  selectClaimsPendingByType(state, props)[props.reward_type];

export const makeSelectIsRewardClaimPending = () =>
  createSelector(selectIsClaimRewardPending, isClaiming => isClaiming);

export const selectClaimErrorsByType = createSelector(
  _selectState,
  state => state.claimErrorsByType
);

const selectClaimRewardError = (state, props) =>
  selectClaimErrorsByType(state, props)[props.reward_type];

export const makeSelectClaimRewardError = () =>
  createSelector(selectClaimRewardError, errorMessage => errorMessage);

const selectRewardByType = (state, props) =>
  selectUnclaimedRewardsByType(state)[props.reward_type];

export const makeSelectRewardByType = () =>
  createSelector(selectRewardByType, reward => reward);

export const makeSelectRewardAmountByType = () =>
  createSelector(
    selectRewardByType,
    reward => (reward ? reward.reward_amount : 0)
  );
