import * as ACTIONS from 'constants/action_types';
import * as MODALS from 'constants/modal_types';
import Lbryio from 'lbryio';
import { selectUnclaimedRewardsByType } from 'redux/selectors/rewards';
import { selectUserIsRewardApproved } from 'redux/selectors/user';
import rewards from 'rewards';

export function doRewardList() {
  return dispatch => {
    dispatch({
      type: ACTIONS.FETCH_REWARDS_STARTED,
    });

    Lbryio.call('reward', 'list', { multiple_rewards_per_type: true })
      .then(userRewards => {
        dispatch({
          type: ACTIONS.FETCH_REWARDS_COMPLETED,
          data: { userRewards },
        });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.FETCH_REWARDS_COMPLETED,
          data: { userRewards: [] },
        });
      });
  };
}

export function doClaimRewardType(rewardType) {
  return (dispatch, getState) => {
    const state = getState();
    const rewardsByType = selectUnclaimedRewardsByType(state);
    const reward = rewardsByType[rewardType];
    const userIsRewardApproved = selectUserIsRewardApproved(state);

    if (!reward || reward.transaction_id) {
      // already claimed or doesn't exist, do nothing
      return;
    }

    if (!userIsRewardApproved && rewardType !== rewards.TYPE_CONFIRM_EMAIL) {
      dispatch({
        type: ACTIONS.OPEN_MODAL,
        data: { modal: MODALS.REWARD_APPROVAL_REQUIRED },
      });

      return;
    }

    dispatch({
      type: ACTIONS.CLAIM_REWARD_STARTED,
      data: { reward },
    });

    const success = successReward => {
      dispatch({
        type: ACTIONS.CLAIM_REWARD_SUCCESS,
        data: {
          reward: successReward,
        },
      });
      if (successReward.reward_type === rewards.TYPE_NEW_USER) {
        dispatch({
          type: ACTIONS.OPEN_MODAL,
          data: { modal: MODALS.FIRST_REWARD },
        });
      }
    };

    const failure = error => {
      dispatch({
        type: ACTIONS.CLAIM_REWARD_FAILURE,
        data: { reward, error },
      });
    };

    rewards.claimReward(rewardType).then(success, failure);
  };
}

export function doClaimEligiblePurchaseRewards() {
  return (dispatch, getState) => {
    const state = getState();
    const rewardsByType = selectUnclaimedRewardsByType(state);
    const userIsRewardApproved = selectUserIsRewardApproved(state);

    if (!userIsRewardApproved || !Lbryio.enabled) {
      return;
    }

    if (rewardsByType[rewards.TYPE_FIRST_STREAM]) {
      dispatch(doClaimRewardType(rewards.TYPE_FIRST_STREAM));
    } else {
      [rewards.TYPE_MANY_DOWNLOADS, rewards.TYPE_FEATURED_DOWNLOAD].forEach(type => {
        dispatch(doClaimRewardType(type));
      });
    }
  };
}

export function doClaimRewardClearError(reward) {
  return dispatch => {
    dispatch({
      type: ACTIONS.CLAIM_REWARD_CLEAR_ERROR,
      data: { reward },
    });
  };
}
