import * as types from "constants/action_types";

const reducers = {};
const defaultState = {
  fetching: false,
  rewardsByType: {},
  claimPendingByType: {},
  claimErrorsByType: {},
};

reducers[types.FETCH_REWARDS_STARTED] = function(state, action) {
  return Object.assign({}, state, {
    fetching: true,
  });
};

reducers[types.FETCH_REWARDS_COMPLETED] = function(state, action) {
  const { userRewards } = action.data;

  const rewardsByType = {};
  userRewards.forEach(reward => (rewardsByType[reward.reward_type] = reward));

  return Object.assign({}, state, {
    rewardsByType: rewardsByType,
    fetching: false,
  });
};

function setClaimRewardState(state, reward, isClaiming, errorMessage = "") {
  const newClaimPendingByType = Object.assign({}, state.claimPendingByType);
  const newClaimErrorsByType = Object.assign({}, state.claimErrorsByType);
  if (isClaiming) {
    newClaimPendingByType[reward.reward_type] = isClaiming;
  } else {
    delete newClaimPendingByType[reward.reward_type];
  }
  if (errorMessage) {
    newClaimErrorsByType[reward.reward_type] = errorMessage;
  } else {
    delete newClaimErrorsByType[reward.reward_type];
  }

  return Object.assign({}, state, {
    claimPendingByType: newClaimPendingByType,
    claimErrorsByType: newClaimErrorsByType,
  });
}

reducers[types.CLAIM_REWARD_STARTED] = function(state, action) {
  const { reward } = action.data;

  return setClaimRewardState(state, reward, true, "");
};

reducers[types.CLAIM_REWARD_SUCCESS] = function(state, action) {
  const { reward } = action.data;

  const existingReward = state.rewardsByType[reward.reward_type];
  const newReward = Object.assign({}, reward, {
    reward_title: existingReward.reward_title,
    reward_description: existingReward.reward_description,
  });
  const rewardsByType = Object.assign({}, state.rewardsByType);

  rewardsByType[reward.reward_type] = newReward;

  const newState = Object.assign({}, state, { rewardsByType });

  return setClaimRewardState(newState, newReward, false, "");
};

reducers[types.CLAIM_REWARD_FAILURE] = function(state, action) {
  const { reward, error } = action.data;

  return setClaimRewardState(state, reward, false, error ? error.message : "");
};

reducers[types.CLAIM_REWARD_CLEAR_ERROR] = function(state, action) {
  const { reward } = action.data;

  return setClaimRewardState(
    state,
    reward,
    state.claimPendingByType[reward.reward_type],
    ""
  );
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
