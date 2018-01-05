import * as ACTIONS from 'constants/action_types';

const reducers = {};
const defaultState = {
  fetching: false,
  claimedRewardsById: {}, // id => reward
  unclaimedRewardsByType: {},
  claimPendingByType: {},
  claimErrorsByType: {},
};

reducers[ACTIONS.FETCH_REWARDS_STARTED] = state =>
  Object.assign({}, state, {
    fetching: true,
  });

reducers[ACTIONS.FETCH_REWARDS_COMPLETED] = (state, action) => {
  const { userRewards } = action.data;

  const unclaimedRewards = {};
  const claimedRewards = {};
  userRewards.forEach(reward => {
    if (reward.transaction_id) {
      claimedRewards[reward.id] = reward;
    } else {
      unclaimedRewards[reward.reward_type] = reward;
    }
  });

  return Object.assign({}, state, {
    claimedRewardsById: claimedRewards,
    unclaimedRewardsByType: unclaimedRewards,
    fetching: false,
  });
};

function setClaimRewardState(state, reward, isClaiming, errorMessage = '') {
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

reducers[ACTIONS.CLAIM_REWARD_STARTED] = (state, action) => {
  const { reward } = action.data;

  return setClaimRewardState(state, reward, true, '');
};

reducers[ACTIONS.CLAIM_REWARD_SUCCESS] = (state, action) => {
  const { reward } = action.data;

  const unclaimedRewardsByType = Object.assign({}, state.unclaimedRewardsByType);
  const existingReward = unclaimedRewardsByType[reward.reward_type];

  const newReward = Object.assign({}, reward, {
    reward_title: existingReward.reward_title,
    reward_description: existingReward.reward_description,
  });

  const claimedRewardsById = Object.assign({}, state.claimedRewardsById);
  claimedRewardsById[reward.id] = newReward;

  const newState = Object.assign({}, state, {
    unclaimedRewardsByType,
    claimedRewardsById,
  });

  return setClaimRewardState(newState, newReward, false, '');
};

reducers[ACTIONS.CLAIM_REWARD_FAILURE] = (state, action) => {
  const { reward, error } = action.data;

  return setClaimRewardState(state, reward, false, error ? error.message : '');
};

reducers[ACTIONS.CLAIM_REWARD_CLEAR_ERROR] = (state, action) => {
  const { reward } = action.data;

  return setClaimRewardState(state, reward, state.claimPendingByType[reward.reward_type], '');
};

export default function reducer(state = defaultState, action) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
