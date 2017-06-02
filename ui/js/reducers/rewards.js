import * as types from "constants/action_types";

const reducers = {}
const defaultState = {
  fetching: false,
  claimPendingByType: {},
  claimErrorsByType: {}
};

reducers[types.FETCH_REWARDS_STARTED] = function(state, action) {
  const newRewards = Object.assign({}, state.rewards, {
    fetching: true,
  })

  return Object.assign({}, state, newRewards)
}

reducers[types.FETCH_REWARDS_COMPLETED] = function(state, action) {
  const {
    userRewards,
  } = action.data

  const byRewardType = {}
  userRewards.forEach(reward => byRewardType[reward.reward_type] = reward)
  const newRewards = Object.assign({}, state.rewards, {
    byRewardType: byRewardType,
    fetching: false
  })

  return Object.assign({}, state, newRewards)
}

function setClaimRewardState(state, reward, isClaiming, errorMessage="") {
  const newClaimPendingByType = Object.assign({}, state.claimPendingByType)
  const newClaimErrorsByType = Object.assign({}, state.claimErrorsByType)
  newClaimPendingByType[reward.reward_type] = isClaiming
  newClaimErrorsByType[reward.reward_type] = errorMessage

  return Object.assign({}, state, {
    claimPendingByType: newClaimPendingByType,
    claimErrorsByType: newClaimErrorsByType,
  })
}

reducers[types.CLAIM_REWARD_STARTED] = function(state, action) {
  const {
    reward,
  } = action.data

  return setClaimRewardState(state, reward, true, "")
}

reducers[types.CLAIM_REWARD_SUCCESS] = function(state, action) {
  const {
    reward,
  } = action.data

  return setClaimRewardState(state, reward, false, "")
}

reducers[types.CLAIM_REWARD_FAILURE] = function(state, action) {
  const {
    reward,
    error
  } = action.data

  return setClaimRewardState(state, reward, false, error.message)
}

reducers[types.CLAIM_REWARD_CLEAR_ERROR] = function(state, action) {
  const {
    reward
  } = action.data

  return setClaimRewardState(state, reward, state.claimPendingByType[reward.reward_type], "")
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
