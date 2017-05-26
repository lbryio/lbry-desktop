import { createSelector } from "reselect";

const _selectState = state => state.rewards || {};

export const selectRewardsByType = createSelector(
  _selectState,
  (state) => state.byRewardType || {}
)

export const selectRewards = createSelector(
  selectRewardsByType,
  (byType) => Object.values(byType) || []
)

export const selectClaimedRewards = createSelector(
  selectRewards,
  (rewards) => rewards.filter(reward => reward.transaction_id !== "")
)

export const selectClaimedRewardsByType = createSelector(
  selectClaimedRewards,
  (claimedRewards) => {
    const byType = []
    claimedRewards.forEach(reward => byType[reward.reward_type] = reward)
    return byType
  }
)

export const selectFetchingRewards = createSelector(
  _selectState,
  (state) => !!state.fetching
)

export const selectHasClaimedReward = (state, props) => {
  return !!selectClaimedRewardsByType[props.reward.reward_type]
}

export const makeSelectHasClaimedReward = () => {
  return createSelector(
    selectHasClaimedReward,
    (claimed) => claimed
  )
}

const selectRewardByType = (state, props) => {
  return selectRewardsByType(state)[props.reward_type]
}

export const makeSelectRewardByType = () => {
  return createSelector(
    selectRewardByType,
    (reward) => reward
  )
}
