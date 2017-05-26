import * as types from "constants/action_types";

const reducers = {};
const defaultState = {};

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

reducers[types.CLAIM_REWARD_STARTED] = function(state, action) {
  const {
    reward,
  } = action.data

  const newRewards = Object.assign({}, state, {
    claiming: true,
  })

  return Object.assign({}, state, newRewards)
}

reducers[types.CLAIM_REWARD_COMPLETED] = function(state, action) {
  const {
    reward,
  } = action.data

  const newRewards = Object.assign({}, state, {
    claiming: false,
  })

  return Object.assign({}, state, newRewards)
}

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
