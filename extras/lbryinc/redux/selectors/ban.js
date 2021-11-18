// @flow

// TODO: This should be in 'redux/selectors/claim.js'. Temporarily putting it
// here to get past importing issues with 'lbryinc', which the real fix might
// involve moving it from 'extras' to 'ui' (big change).

import { createCachedSelector } from 're-reselect';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { getChannelFromClaim } from 'util/claim';
import { isURIEqual } from 'util/lbryURI';

export const selectBanStateForUri = createCachedSelector(
  selectClaimForUri,
  selectBlackListedOutpoints,
  selectFilteredOutpoints,
  selectMutedChannels,
  selectModerationBlockList,
  (claim, blackListedOutpoints, filteredOutpoints, mutedChannelUris, personalBlocklist) => {
    const banState = {};

    if (!claim) {
      return banState;
    }

    const channelClaim = getChannelFromClaim(claim);

    // This will be replaced once blocking is done at the wallet server level.
    if (blackListedOutpoints) {
      if (
        blackListedOutpoints.some(
          (outpoint) =>
            (channelClaim && outpoint.txid === channelClaim.txid && outpoint.nout === channelClaim.nout) ||
            (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
        )
      ) {
        banState['blacklisted'] = true;
      }
    }

    // We're checking to see if the stream outpoint or signing channel outpoint
    // is in the filter list.
    if (filteredOutpoints) {
      if (
        filteredOutpoints.some(
          (outpoint) =>
            (channelClaim && outpoint.txid === channelClaim.txid && outpoint.nout === channelClaim.nout) ||
            (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
        )
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
