import lbry from './lbry.js';
import lbryio from './lbryio.js';

function rewardMessage(type, amount) {
  return {
    new_developer: "Your reward has been confirmed for registering as a new developer.",
    new_user: `You received ${amount} LBC new user reward.`,
    confirm_email: "Your reward has been confirmed for verifying your email address.",
    first_publish: "Your reward has been confirmed for making your first publication.",
  }[type];
}

const rewards = {};

rewards.claimReward = function(type) {
  return new Promise((resolve, reject) => {
    console.log('top of promise body')
    lbry.get_new_address().then((address) => {
      const params = {
        reward_type: type,
        wallet_address: address,
      };
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
    });
  });
}

export default rewards;