import lbry from "lbry";
import lbryio from "lbryio";
import { doShowSnackBar } from "redux/actions/app";

function rewardMessage(type, amount) {
  return {
    new_developer: __(
      "You earned %s for registering as a new developer.",
      amount
    ),
    new_user: __("You earned %s LBC new user reward.", amount),
    confirm_email: __(
      "You earned %s LBC for verifying your email address.",
      amount
    ),
    new_channel: __(
      "You earned %s LBC for creating a publisher identity.",
      amount
    ),
    first_stream: __(
      "You earned %s LBC for streaming your first video.",
      amount
    ),
    many_downloads: __(
      "You earned %s LBC for downloading a bunch of things.",
      amount
    ),
    first_publish: __(
      "You earned %s LBC for making your first publication.",
      amount
    ),
    featured_download: __(
      "You earned %s LBC for watching a featured download.",
      amount
    ),
    referral: __("You earned %s LBC for referring someone.", amount),
  }[type];
}

const rewards = {};

rewards.TYPE_NEW_DEVELOPER = "new_developer";
rewards.TYPE_NEW_USER = "new_user";
rewards.TYPE_CONFIRM_EMAIL = "verified_email";
rewards.TYPE_FIRST_CHANNEL = "new_channel";
rewards.TYPE_FIRST_STREAM = "first_stream";
rewards.TYPE_MANY_DOWNLOADS = "many_downloads";
rewards.TYPE_FIRST_PUBLISH = "first_publish";
rewards.TYPE_FEATURED_DOWNLOAD = "featured_download";
rewards.TYPE_REFERRAL = "referral";
rewards.SORT_ORDER = [
  rewards.TYPE_NEW_USER,
  rewards.TYPE_CONFIRM_EMAIL,
  rewards.TYPE_FIRST_STREAM,
  rewards.TYPE_FIRST_CHANNEL,
  rewards.TYPE_FIRST_PUBLISH,
  rewards.TYPE_FEATURED_DOWNLOAD,
  rewards.TYPE_MANY_DOWNLOADS,
  rewards.TYPE_REFERRAL,
  rewards.TYPE_NEW_DEVELOPER,
];

rewards.claimReward = function(type) {
  function requestReward(resolve, reject, params) {
    if (!lbryio.enabled) {
      reject(new Error(__("Rewards are not enabled.")));
      return;
    }
    lbryio.call("reward", "new", params, "post").then(reward => {
      const message = rewardMessage(type, reward.reward_amount);

      // Display global notice
      const action = doShowSnackBar({
        message,
        linkText: __("Show All"),
        linkTarget: "/rewards",
        isError: false,
      });
      window.app.store.dispatch(action);

      // Add more events here to display other places

      resolve(reward);
    }, reject);
  }

  return new Promise((resolve, reject) => {
    lbry.wallet_unused_address().then(address => {
      const params = {
        reward_type: type,
        wallet_address: address,
      };

      switch (type) {
        case rewards.TYPE_FIRST_CHANNEL:
          lbry
            .claim_list_mine()
            .then(claims => {
              const claim = claims
                .reverse()
                .find(
                  claim =>
                    claim.name.length &&
                    claim.name[0] == "@" &&
                    claim.txid.length &&
                    claim.category == "claim"
                );
              if (claim) {
                params.transaction_id = claim.txid;
                requestReward(resolve, reject, params);
              } else {
                reject(
                  new Error(__("Please create a channel identity first."))
                );
              }
            })
            .catch(reject);
          break;

        case rewards.TYPE_FIRST_PUBLISH:
          lbry
            .claim_list_mine()
            .then(claims => {
              const claim = claims
                .reverse()
                .find(
                  claim =>
                    claim.name.length &&
                    claim.name[0] != "@" &&
                    claim.txid.length &&
                    claim.category == "claim"
                );
              if (claim) {
                params.transaction_id = claim.txid;
                requestReward(resolve, reject, params);
              } else {
                reject(
                  claims.length
                    ? new Error(
                        __(
                          "Please publish something and wait for confirmation by the network to claim this reward."
                        )
                      )
                    : new Error(
                        __("Please publish something to claim this reward.")
                      )
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

export default rewards;
