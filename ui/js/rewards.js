const hashes = require('jshashes');
import lbry from 'lbry';
import lbryio from 'lbryio';
import {
  doShowSnackBar,
} from 'actions/app'

function rewardMessage(type, amount) {
  return {
    new_developer: `You earned ${amount} for registering as a new developer.`,
    new_user: `You earned ${amount} LBC new user reward.`,
    confirm_email: `You earned ${amount} LBC for verifying your email address.`,
    new_channel: `You earned ${amount} LBC for creating a publisher identity.`,
    first_stream: `You earned ${amount} LBC for streaming your first video.`,
    many_downloads: `You earned ${amount} LBC for downloading some of the things.`,
    first_publish: `You earned ${amount} LBC for making your first publication.`,
  }[type];
}

function toHex(s) {
  let h = ''
  for (var i = 0; i < s.length; i++)
  {
    let c = s.charCodeAt(i).toString(16);
    if (c.length < 2)
    {
      c = "0".concat(c);
    }
    h += c;
  }
  return h;
}

function fromHex(h) {
  let s = ''
  for (let i = 0; i < h.length; i += 2)
  {
    s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
  }
  return s;
}

function reverseString(s) {
  let o = '';
  for (let i = s.length - 1; i >= 0; i--)
  {
    o += s[i];
  }
  return o;
}

function pack(num) {
  return "" +
    String.fromCharCode((num      ) & 0xFF) +
    String.fromCharCode((num >>  8) & 0xFF) +
    String.fromCharCode((num >> 16) & 0xFF) +
    String.fromCharCode((num >> 24) & 0xFF);
}

// Returns true if claim is an initial claim, false if it's an update to an existing claim
function isInitialClaim(claim) {
  const reversed = reverseString(fromHex(claim.txid))
  const concat = reversed.concat(pack(claim.nout))
  const sha256 = (new hashes.SHA256({utf8: false})).raw(concat)
  const ripemd160 = (new hashes.RMD160({utf8: false})).raw(sha256)
  const hash = toHex(reverseString(ripemd160));
  return hash == claim.claim_id;
}

const rewards = {};

rewards.TYPE_NEW_DEVELOPER = "new_developer",
rewards.TYPE_NEW_USER = "new_user",
rewards.TYPE_CONFIRM_EMAIL = "confirm_email",
rewards.TYPE_FIRST_CHANNEL = "new_channel",
rewards.TYPE_FIRST_STREAM = "first_stream",
rewards.TYPE_MANY_DOWNLOADS = "many_downloads",
rewards.TYPE_FIRST_PUBLISH = "first_publish";

rewards.claimReward = function (type) {

  function requestReward(resolve, reject, params) {
    if (!lbryio.enabled) {
      reject(new Error("Rewards are not enabled."))
      return;
    }
    lbryio.call('reward', 'new', params, 'post').then(({reward_amount}) => {
      const
        message = rewardMessage(type, reward_amount),
        result = {
          type: type,
          amount: reward_amount,
          message: message
        };

      // Display global notice
      const action = doShowSnackBar({
        message,
        linkText: "Show All",
        linkTarget: "/rewards",
        isError: false,
      })
      window.app.store.dispatch(action)

      // Add more events here to display other places

      resolve(result);
    }, reject);
  }

  return new Promise((resolve, reject) => {
    lbry.wallet_unused_address().then((address) => {
      const params = {
        reward_type: type,
        wallet_address: address,
      };

      switch (type) {
        case rewards.TYPE_FIRST_CHANNEL:
          lbry.claim_list_mine().then(function(claims) {
            let claim = claims.find(function(claim) {
              return claim.name.length && claim.name[0] == '@' && claim.txid.length && isInitialClaim(claim)
            })
            if (claim) {
              params.transaction_id = claim.txid;
              requestReward(resolve, reject, params)
            } else {
              reject(new Error("Please create a channel identity first."))
            }
          }).catch(reject)
          break;

        case rewards.TYPE_FIRST_PUBLISH:
          lbry.claim_list_mine().then((claims) => {
            let claim = claims.find(function(claim) {
              return claim.name.length && claim.name[0] != '@' && claim.txid.length && isInitialClaim(claim)
            })
            if (claim) {
              params.transaction_id = claim.txid
              requestReward(resolve, reject, params)
            } else {
              reject(claims.length ?
                     new Error("Please publish something and wait for confirmation by the network to claim this reward.") :
                     new Error("Please publish something to claim this reward."))
            }
          }).catch(reject)
          break;

        case rewards.TYPE_FIRST_STREAM:
        case rewards.TYPE_NEW_USER:
        default:
          requestReward(resolve, reject, params);
      }
    });
  });
}

rewards.claimNextPurchaseReward = function() {
  let types = {}
  types[rewards.TYPE_FIRST_STREAM] = false
  types[rewards.TYPE_MANY_DOWNLOADS] = false
  lbryio.call('reward', 'list', {}).then((userRewards) => {
    userRewards.forEach((reward) => {
      if (types[reward.reward_type] === false && reward.transaction_id) {
        types[reward.reward_type] = true
      }
    })
    let unclaimedType = Object.keys(types).find((type) => {
      return types[type] === false;
    })
    if (unclaimedType) {
      rewards.claimReward(unclaimedType);
    }
  }, () => { });
}

export default rewards;