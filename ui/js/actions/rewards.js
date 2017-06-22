import * as types from "constants/action_types";
import lbryio from "lbryio";
import rewards from "rewards";
import { selectRewardsByType } from "selectors/rewards";

export function doRewardList() {
  return function(dispatch, getState) {
    const state = getState();

    dispatch({
      type: types.FETCH_REWARDS_STARTED,
    });

    lbryio
      .call("reward", "list", {})
      .then(userRewards => {
        dispatch({
          type: types.FETCH_REWARDS_COMPLETED,
          data: { userRewards },
        });
      })
      .catch(() => {
        dispatch({
          type: types.FETCH_REWARDS_COMPLETED,
          data: { userRewards: [] },
        });
      });
  };
}

export function doClaimRewardType(rewardType) {
  return function(dispatch, getState) {
    const rewardsByType = selectRewardsByType(getState()),
      reward = rewardsByType[rewardType];

    if (reward) {
      dispatch(doClaimReward(reward));
    }
  };
}

export function doClaimReward(reward, saveError = false) {
  return function(dispatch, getState) {
    if (reward.transaction_id) {
      //already claimed, do nothing
      return;
    }

    dispatch({
      type: types.CLAIM_REWARD_STARTED,
      data: { reward },
    });

    const success = reward => {
      dispatch({
        type: types.CLAIM_REWARD_SUCCESS,
        data: {
          reward,
        },
      });
    };

    const failure = error => {
      dispatch({
        type: types.CLAIM_REWARD_FAILURE,
        data: {
          reward,
          error: saveError ? error : null,
        },
      });
    };

    rewards.claimReward(reward.reward_type).then(success, failure);
  };
}

export function doClaimEligiblePurchaseRewards() {
  return function(dispatch, getState) {
    if (!lbryio.enabled) {
      return;
    }

    const rewardsByType = selectRewardsByType(getState());

    let types = {};

    types[rewards.TYPE_FIRST_STREAM] = false;
    types[rewards.TYPE_FEATURED_DOWNLOAD] = false;
    types[rewards.TYPE_MANY_DOWNLOADS] = false;
    Object.values(rewardsByType).forEach(reward => {
      if (types[reward.reward_type] === false && reward.transaction_id) {
        types[reward.reward_type] = true;
      }
    });

    let unclaimedType = Object.keys(types).find(type => {
      return types[type] === false && type !== rewards.TYPE_FEATURED_DOWNLOAD; //handled below
    });
    if (unclaimedType) {
      dispatch(doClaimRewardType(unclaimedType));
    }
    if (types[rewards.TYPE_FEATURED_DOWNLOAD] === false) {
      dispatch(doClaimRewardType(rewards.TYPE_FEATURED_DOWNLOAD));
    }
  };
}

export function doClaimRewardClearError(reward) {
  return function(dispatch, getState) {
    dispatch({
      type: types.CLAIM_REWARD_CLEAR_ERROR,
      data: { reward },
    });
  };
}
