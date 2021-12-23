import Lbry from 'lbry';
import { doToast } from 'redux/actions/notifications';
import { Lbryio } from 'lbryinc';

const rewards = {};

rewards.TYPE_NEW_DEVELOPER = 'new_developer';
rewards.TYPE_NEW_USER = 'new_user';
rewards.TYPE_CONFIRM_EMAIL = 'email_provided';
rewards.TYPE_FIRST_CHANNEL = 'new_channel';
rewards.TYPE_FIRST_STREAM = 'first_stream';
rewards.TYPE_MANY_DOWNLOADS = 'many_downloads';
rewards.TYPE_FIRST_PUBLISH = 'first_publish';
rewards.TYPE_REFERRAL = 'referrer';
rewards.TYPE_REFEREE = 'referee';
rewards.TYPE_REWARD_CODE = 'reward_code';
rewards.TYPE_SUBSCRIPTION = 'subscription';
rewards.YOUTUBE_CREATOR = 'youtube_creator';
rewards.TYPE_WEEKLY_WATCH = 'weekly_watch';
rewards.TYPE_NEW_ANDROID = 'new_android';

rewards.claimReward = (type, rewardParams) => {
  function requestReward(resolve, reject, params) {
    if (!Lbryio.enabled) {
      reject(new Error(__('Rewards are not enabled.')));
      return;
    }

    Lbryio.call('reward', 'claim', params, 'post').then((reward) => {
      const message = reward.reward_notification || `You have claimed a ${reward.reward_amount} LBRY Credit reward.`;

      // Display global notice
      const action = doToast({
        message,
        linkText: __('Show All'),
        linkTarget: '/rewards',
      });
      window.store.dispatch(action);

      if (rewards.callbacks.claimRewardSuccess) {
        rewards.callbacks.claimRewardSuccess(reward);
      }

      resolve(reward);
    }, reject);
  }

  return new Promise((resolve, reject) => {
    Lbry.address_unused().then((address) => {
      const params = {
        reward_type: type,
        wallet_address: address,
        ...rewardParams,
      };

      switch (type) {
        case rewards.TYPE_FIRST_CHANNEL:
          Lbry.channel_list({ page: 1, page_size: 10 })
            .then((claims) => {
              const claim =
                claims.items &&
                claims.items.find(
                  (foundClaim) =>
                    foundClaim.name.length &&
                    foundClaim.name[0] === '@' &&
                    foundClaim.txid.length &&
                    foundClaim.type === 'claim'
                );
              if (claim) {
                params.transaction_id = claim.txid;
                requestReward(resolve, reject, params);
              } else {
                reject(new Error(__('Please create a channel identity first.')));
              }
            })
            .catch(reject);
          break;

        case rewards.TYPE_FIRST_PUBLISH:
          Lbry.stream_list({ page: 1, page_size: 10 })
            .then((claims) => {
              const claim =
                claims.items &&
                claims.items.find(
                  (foundClaim) =>
                    foundClaim.name.length &&
                    foundClaim.name[0] !== '@' &&
                    foundClaim.txid.length &&
                    foundClaim.type === 'claim'
                );
              if (claim) {
                params.transaction_id = claim.txid;
                requestReward(resolve, reject, params);
              } else {
                reject(
                  claims.length
                    ? new Error(
                        __('Please upload something and wait for confirmation by the network to claim this reward.')
                      )
                    : new Error(__('Please upload something to claim this reward.'))
                );
              }
            })
            .catch(reject);
          break;

        case rewards.TYPE_FIRST_STREAM:
        case rewards.TYPE_NEW_USER:
        default:
          requestReward(resolve, reject, params);
      }
    });
  });
};
rewards.callbacks = {
  // Set any callbacks that require code not found in this project
  claimRewardSuccess: null,
  claimFirstRewardSuccess: null,
  rewardApprovalRequired: null,
};

rewards.setCallback = (name, method) => {
  rewards.callbacks[name] = method;
};

export default rewards;
