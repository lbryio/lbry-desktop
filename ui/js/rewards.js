import lbry from './lbry.js';
import lbryio from './lbryio.js';

function rewardMessage(type, amount) {
  return {
    new_developer: "You received ${amount} for registering as a new developer.",
    new_user: `You received ${amount} LBC new user reward.`,
    confirm_email: "You received ${amount} LBC for verifying your email address.",
    first_channel: "You received ${amount} LBC for creating a publisher identity.",
    first_purchase: "You received ${amount} LBC for making your first purchase.",
    first_publish: "You received ${amount} LBC for making your first publication.",
  }[type];
}

const rewards = {};

rewards.TYPE_NEW_DEVELOPER = "new_developer",
  rewards.TYPE_NEW_USER = "new_user",
  rewards.TYPE_CONFIRM_EMAIL = "confirm_email",
  rewards.TYPE_FIRST_CHANNEL = "first_channel",
  rewards.TYPE_FIRST_PURCHASE = "first_purchase",
  rewards.TYPE_FIRST_PUBLISH = "first_publish";

rewards.claimReward = function (type) {

  function requestReward(resolve, reject, params) {
    lbryio.call('reward', 'new', params, 'post').then(({RewardAmount}) => {
      const
        message = rewardMessage(type, RewardAmount),
        result = {
          type: type,
          amount: RewardAmount,
          message: message
        };

      // Display global notice
      document.dispatchEvent(new CustomEvent('globalNotice', {
        detail: {
          message: message,
          linkText: "Show All",
          linkTarget: "?rewards",
          isError: false,
        },
      }));

      // Add more events here to display other places

      resolve(result);
    }, reject);
  }

  return new Promise((resolve, reject) => {
    lbry.get_new_address().then((address) => {
      const params = {
        reward_type: type,
        wallet_address: address,
      };

      switch (type) {
        case rewards.TYPE_FIRST_CHANNEL:
          lbry.claim_list_mine().then(function(channels) {
            if (channels.length) {
              params.transaction_id = channels[0].txid;
              requestReward(resolve, reject, params)
            } else {
              reject(new Error("Please create a channel identity first."))
            }
          }).catch(reject)
          break;

        case 'first_purchase':
          // lbry.claim_list_mine().then(function(channels) {
          //   if (channels.length) {
          //     requestReward(resolve, reject, {transaction_id: channels[0].txid})
          //   }
          // }).catch(reject)
          break;

        case 'first_channel':
          //params.transaction_id = RelevantTransactionID;
          break;

        default:
          requestReward(resolve, reject, params);
      }
    });
  });
}

export default rewards;