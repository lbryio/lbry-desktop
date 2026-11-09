//@ts-nocheck
import * as ACTIONS from 'constants/action_types';
const reducers: Record<string, any> = {};
const defaultState = {
  fetching: false,
  claimedRewardsById: {}, // id => reward
  unclaimedRewards: [],
  claimPendingByType: {},
  claimErrorsByType: {},
  rewardedContentClaimIds: [],
} as const;

reducers[ACTIONS.FETCH_REWARDS_STARTED] = (state: unknown) =>
  Object.assign({}, state, {
    fetching: true,
  });

reducers[ACTIONS.FETCH_REWARDS_COMPLETED] = (state: unknown, action: unknown) => {
  const { userRewards } = action.data;

  const unclaimedRewards: unknown = [];
  const claimedRewards: Record<string, any> = {};
  userRewards.forEach((reward) => {
    if (reward.transaction_id) {
      claimedRewards[reward.id] = reward;
    } else {
      unclaimedRewards.push(reward);
    }
  });

  return Object.assign({}, state, {
    claimedRewardsById: claimedRewards,
    unclaimedRewards,
    fetching: false,
  });
};

function setClaimRewardState(state: unknown, reward: unknown, isClaiming: unknown, errorMessage = '') {
  const newClaimPendingByType = Object.assign({}, state.claimPendingByType);
  const newClaimErrorsByType = Object.assign({}, state.claimErrorsByType);

  // Currently, for multiple rewards of the same type, they will both show "claiming" when one is beacuse we track this by `reward_type`
  // To fix this we will need to use `claim_code` instead, and change all selectors to match
  if (reward) {
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
  }

  return Object.assign({}, state, {
    claimPendingByType: newClaimPendingByType,
    claimErrorsByType: newClaimErrorsByType,
  });
}

reducers[ACTIONS.CLAIM_REWARD_STARTED] = (state: unknown, action: unknown) => {
  const { reward } = action.data;

  return setClaimRewardState(state, reward, true, '');
};

reducers[ACTIONS.CLAIM_REWARD_SUCCESS] = (state: unknown, action: unknown) => {
  const { reward } = action.data;
  const { unclaimedRewards } = state;

  const index = unclaimedRewards.findIndex((ur) => ur.claim_code === reward.claim_code);
  unclaimedRewards.splice(index, 1);

  const { claimedRewardsById } = state;
  claimedRewardsById[reward.id] = reward;

  const newState = {
    ...state,
    unclaimedRewards: [...unclaimedRewards],
    claimedRewardsById: { ...claimedRewardsById },
  } as const;

  return setClaimRewardState(newState, reward, false, '');
};

reducers[ACTIONS.CLAIM_REWARD_FAILURE] = (state: unknown, action: unknown) => {
  const { reward, error } = action.data;

  return setClaimRewardState(state, reward, false, error ? error.message : '');
};

reducers[ACTIONS.CLAIM_REWARD_CLEAR_ERROR] = (state: unknown, action: unknown) => {
  const { reward } = action.data;

  return setClaimRewardState(state, reward, state.claimPendingByType[reward.reward_type], '');
};

reducers[ACTIONS.FETCH_REWARD_CONTENT_COMPLETED] = (state: unknown, action: unknown) => {
  const { claimIds } = action.data;

  return Object.assign({}, state, {
    rewardedContentClaimIds: claimIds,
  });
};

export default function rewardsReducer(state = defaultState, action: unknown) {
  const handler = reducers[action.type];
  if (handler) return handler(state, action);
  return state;
}
