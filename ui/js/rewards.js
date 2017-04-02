import lbry from './lbry.js';
import lbryio from './lbryio.js';

const MESSAGES = {
  new_developer: "Your reward has been confirmed for registering as a new developer.",
  confirm_email: "Your reward has been confirmed for verifying your email address.",
  first_publish: "Your reward has been confirmed for making your first publication.",
};

const rewards = {};

rewards.claimReward = function(type) {
  console.log('top of claimReward')
  return new Promise((resolve, reject) => {
    console.log('top of promise body')
    lbry.get_new_address().then((address) => {
      console.log('top of get_new_address')
      const params = {
        reward_type: type,
        wallet_address: address,
      };
      lbryio.call('reward', 'new', params, 'post').then(({RewardAmount}) => {
        const result = {
          type: type,
          amount: RewardAmount,
          message: MESSAGES[type],
        };

        // Display global notice
        document.dispatchEvent(new CustomEvent('globalNotice', {
          detail: {
            message: MESSAGES[type],
            isError: false,            
          },
        }));

        // Add more events here to display other places

        resolve(result);
      }, (error) => {
        document.dispatchEvent(new CustomEvent('globalNotice', {
          detail: {
            message: `Failed to claim reward: ${error.message}`,
            isError: true,            
          },
        }));
        document.dispatchEvent(new CustomEvent('rewardFailed', error));
        reject(error);
      });
    });
  });
}

export default rewards;