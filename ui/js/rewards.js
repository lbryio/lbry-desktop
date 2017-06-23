const hashes = require("jshashes");
import lbry from "lbry";
import lbryio from "lbryio";
import { doShowSnackBar } from "actions/app";

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
      "You earned %s LBC for downloading some of the things.",
      amount
    ),
    first_publish: __(
      "You earned %s LBC for making your first publication.",
      amount
    ),
  }[type];
}

function toHex(s) {
  let h = "";
  for (var i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i).toString(16);
    if (c.length < 2) {
      c = "0".concat(c);
    }
    h += c;
  }
  return h;
}

function fromHex(h) {
  let s = "";
  for (let i = 0; i < h.length; i += 2) {
    s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
  }
  return s;
}

function reverseString(s) {
  let o = "";
  for (let i = s.length - 1; i >= 0; i--) {
    o += s[i];
  }
  return o;
}

function pack(num) {
  return (
    "" +
    String.fromCharCode(num & 0xff) +
    String.fromCharCode((num >> 8) & 0xff) +
    String.fromCharCode((num >> 16) & 0xff) +
    String.fromCharCode((num >> 24) & 0xff)
  );
}

// Returns true if claim is an initial claim, false if it's an update to an existing claim
function isInitialClaim(claim) {
  const reversed = reverseString(fromHex(claim.txid));
  const concat = reversed.concat(pack(claim.nout));
  const sha256 = new hashes.SHA256({ utf8: false }).raw(concat);
  const ripemd160 = new hashes.RMD160({ utf8: false }).raw(sha256);
  const hash = toHex(reverseString(ripemd160));
  return hash == claim.claim_id;
}

const rewards = {};

rewards.TYPE_NEW_DEVELOPER = "new_developer";
rewards.TYPE_NEW_USER = "new_user";
rewards.TYPE_CONFIRM_EMAIL = "confirm_email";
rewards.TYPE_FIRST_CHANNEL = "new_channel";
rewards.TYPE_FIRST_STREAM = "first_stream";
rewards.TYPE_MANY_DOWNLOADS = "many_downloads";
rewards.TYPE_FIRST_PUBLISH = "first_publish";
rewards.TYPE_FEATURED_DOWNLOAD = "featured_download";

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
            .then(function(claims) {
              let claim = claims.reverse().find(function(claim) {
                return (
                  claim.name.length &&
                  claim.name[0] == "@" &&
                  claim.txid.length &&
                  isInitialClaim(claim)
                );
              });
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
              let claim = claims.reverse().find(function(claim) {
                return (
                  claim.name.length &&
                  claim.name[0] != "@" &&
                  claim.txid.length &&
                  isInitialClaim(claim)
                );
              });
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
