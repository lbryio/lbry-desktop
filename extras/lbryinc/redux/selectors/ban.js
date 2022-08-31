// @flow

// TODO: This should be in 'redux/selectors/claim.js'. Temporarily putting it
// here to get past importing issues with 'lbryinc', which the real fix might
// involve moving it from 'extras' to 'ui' (big change).

import { createCachedSelector } from 're-reselect';
import { selectClaimForUri, makeSelectIsBlacklisted } from 'redux/selectors/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { getChannelFromClaim } from 'util/claim';
import { isURIEqual } from 'util/lbryURI';

export const selectBanStateForUri = createCachedSelector(
  selectClaimForUri,
  selectMutedChannels,
  selectModerationBlockList,
  (state, uri) => makeSelectIsBlacklisted(uri)(state),
  (claim, mutedChannelUris, personalBlocklist, isBlacklisted) => {
    const banState = {};

    if (!claim) {
      return banState;
    }

    const channelClaim = getChannelFromClaim(claim);

    if (isBlacklisted) {
      banState['blacklisted'] = true;
    }

    // block stream claims
    // block channel claims if we can't control for them in claim search
    if (mutedChannelUris.length && channelClaim) {
      if (mutedChannelUris.some((blockedUri) => isURIEqual(blockedUri, channelClaim.permanent_url))) {
        banState['muted'] = true;
      }
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
