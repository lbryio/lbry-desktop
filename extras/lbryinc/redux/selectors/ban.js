// @flow

// TODO: This should be in 'redux/selectors/claim.js'. Temporarily putting it
// here to get past importing issues with 'lbryinc', which the real fix might
// involve moving it from 'extras' to 'ui' (big change).

import { createCachedSelector } from 're-reselect';
import { selectClaimForUri, makeSelectIsBlacklisted } from 'redux/selectors/claims';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { getChannelFromClaim } from 'util/claim';
import { isURIEqual } from 'util/lbryURI';

export const selectBanStateForUri = createCachedSelector(
  selectClaimForUri,
  selectModerationBlockList,
  (state, uri) => makeSelectIsBlacklisted(uri)(state),
  (claim, personalBlocklist, isBlacklisted) => {
    const banState = {};

    if (!claim) {
      return banState;
    }

    const channelClaim = getChannelFromClaim(claim);

    if (isBlacklisted) {
      banState['blacklisted'] = true;
    }

    // Commentron blocklist
    if (personalBlocklist.length && channelClaim) {
      if (personalBlocklist.some((blockedUri) => isURIEqual(blockedUri, channelClaim.permanent_url))) {
        banState['blocked'] = true;
      }
    }

    return banState;
  }
)((state, uri) => String(uri));
