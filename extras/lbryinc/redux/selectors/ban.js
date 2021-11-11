// @flow

// TODO: This should be in 'redux/selectors/claim.js'. Temporarily putting it
// here to get past importing issues with 'lbryinc', which the real fix might
// involve moving it from 'extras' to 'ui' (big change).

import { createCachedSelector } from 're-reselect';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectBlacklistedOutpointMap, selectFilteredOutpointMap } from 'lbryinc';
import { getChannelFromClaim } from 'util/claim';
import { isURIEqual } from 'util/lbryURI';

export const selectBanStateForUri = createCachedSelector(
  selectClaimForUri,
  selectBlacklistedOutpointMap,
  selectFilteredOutpointMap,
  selectMutedChannels,
  selectModerationBlockList,
  (claim, blackListedOutpointMap, filteredOutpointMap, mutedChannelUris, personalBlocklist) => {
    const banState = {};

    if (!claim) {
      return banState;
    }

    const channelClaim = getChannelFromClaim(claim);

    // This will be replaced once blocking is done at the wallet server level.
    if (blackListedOutpointMap) {
      if (
        (channelClaim && blackListedOutpointMap[`${channelClaim.txid}:${channelClaim.nout}`]) ||
        blackListedOutpointMap[`${claim.txid}:${claim.nout}`]
      ) {
        banState['blacklisted'] = true;
      }
    }

    // We're checking to see if the stream outpoint or signing channel outpoint
    // is in the filter list.
    if (filteredOutpointMap) {
      if (
        (channelClaim && filteredOutpointMap[`${channelClaim.txid}:${channelClaim.nout}`]) ||
        filteredOutpointMap[`${claim.txid}:${claim.nout}`]
      ) {
        banState['filtered'] = true;
      }
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
