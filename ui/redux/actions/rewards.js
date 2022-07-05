import { Lbryio } from 'lbryinc';
import { doUpdateBalance } from 'redux/actions/wallet';
import { doToast } from 'redux/actions/notifications';
import * as ACTIONS from 'constants/action_types';
import { selectUnclaimedRewards, selectWeeklyWatchClaimedThisWeek } from 'redux/selectors/rewards';
import { selectUserIsRewardApproved } from 'redux/selectors/user';
import { doFetchInviteStatus } from 'redux/actions/user';
import rewards from 'rewards';
import { resolveApiMessage } from 'util/api-message';

export function doRewardList() {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_REWARDS_STARTED,
    });

    Lbryio.call('reward', 'list', { multiple_rewards_per_type: true })
      .then((userRewards) => {
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

export function doClaimRewardType(rewardType, options = {}) {
  return (dispatch, getState) => {
    const state = getState();
    const userIsRewardApproved = selectUserIsRewardApproved(state);
    const unclaimedRewards = selectUnclaimedRewards(state);
    const reward =
      rewardType === rewards.TYPE_REWARD_CODE || rewardType === rewards.TYPE_NEW_ANDROID
        ? { reward_type: rewards.TYPE_REWARD_CODE }
        : unclaimedRewards.find((ur) => ur.reward_type === rewardType);

    // Try to claim the email reward right away, even if we haven't called reward_list yet
    if (
      rewardType !== rewards.TYPE_REWARD_CODE &&
      rewardType !== rewards.TYPE_CONFIRM_EMAIL &&
      rewardType !== rewards.TYPE_WEEKLY_WATCH &&
      rewardType !== rewards.TYPE_NEW_ANDROID
    ) {
      if (!reward || reward.transaction_id) {
        // already claimed or doesn't exist, do nothing
        return;
      }
    }

    if (
      !userIsRewardApproved &&
      rewardType !== rewards.TYPE_CONFIRM_EMAIL &&
      rewardType !== rewards.TYPE_REWARD_CODE &&
      rewardType !== rewards.TYPE_NEW_ANDROID
    ) {
      if (!options || (!options.failSilently && rewards.callbacks.rewardApprovalRequested)) {
        rewards.callbacks.rewardApprovalRequested();
      }

      return;
    }

    // Set `claim_code` so the api knows which reward to give if there are multiple of the same type
    const params = options.params || {};
    if (!params.claim_code && reward) {
      params.claim_code = reward.claim_code;
    }

    dispatch({
      type: ACTIONS.CLAIM_REWARD_STARTED,
      data: { reward },
    });

    const success = (successReward) => {
      // Temporary timeout to ensure the sdk has the correct balance after claiming a reward
      setTimeout(() => {
        dispatch(doUpdateBalance()).then(() => {
          dispatch({
            type: ACTIONS.CLAIM_REWARD_SUCCESS,
            data: {
              reward: successReward,
            },
          });
          if (successReward.reward_type === rewards.TYPE_NEW_USER && rewards.callbacks.claimFirstRewardSuccess) {
            rewards.callbacks.claimFirstRewardSuccess();
          } else if (successReward.reward_type === rewards.TYPE_REFERRAL) {
            dispatch(doFetchInviteStatus());
          }

          dispatch(doRewardList());

          if (options.callback) {
            options.callback();
          }
        });
      }, 2000);
    };

    const failure = (error) => {
      dispatch({
        type: ACTIONS.CLAIM_REWARD_FAILURE,
        data: {
          reward,
          error: !options || !options.failSilently ? error : undefined,
        },
      });

      if (options.notifyError) {
        dispatch(doToast({ message: resolveApiMessage(error.message), isError: true }));
      }

      if (options.callback) {
        options.callback(error);
      }
    };

    return rewards.claimReward(rewardType, params).then(success, failure);
  };
}

export function doClaimInitialRewards() {
  return (dispatch) => {
    dispatch(doClaimRewardType(rewards.TYPE_NEW_USER));
    dispatch(doClaimRewardType(rewards.TYPE_CONFIRM_EMAIL));
  };
}

export function doClaimEligiblePurchaseRewards() {
  return (dispatch, getState) => {
    const state = getState();
    const unclaimedRewards = selectUnclaimedRewards(state);
    const userIsRewardApproved = selectUserIsRewardApproved(state);

    if (!userIsRewardApproved || !Lbryio.enabled) {
      return;
    }

    if (unclaimedRewards.find((ur) => ur.reward_type === rewards.TYPE_FIRST_STREAM)) {
      dispatch(doClaimRewardType(rewards.TYPE_FIRST_STREAM));
    } else {
      if (!selectWeeklyWatchClaimedThisWeek(state)) {
        dispatch(doClaimRewardType(rewards.TYPE_WEEKLY_WATCH, { failSilently: true }));
      }
    }
  };
}

export function doClaimRewardClearError(reward) {
  return (dispatch) => {
    dispatch({
      type: ACTIONS.CLAIM_REWARD_CLEAR_ERROR,
      data: { reward },
    });
  };
}

export function doFetchRewardedContent() {
  return (dispatch) => {
    const success = (nameToClaimId) => {
      dispatch({
        type: ACTIONS.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: Object.values(nameToClaimId),
          success: true,
        },
      });
    };

    const failure = () => {
      dispatch({
        type: ACTIONS.FETCH_REWARD_CONTENT_COMPLETED,
        data: {
          claimIds: [],
          success: false,
        },
      });
    };

    Lbryio.call('reward', 'list_featured').then(success, failure);
  };
}
