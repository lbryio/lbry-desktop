// @flow

// TODO: This should be in 'redux/selectors/claim.js'. Temporarily putting it
// here to get past importing issues with 'lbryinc', which the real fix might
// involve moving it from 'extras' to 'ui' (big change).

import { createCachedSelector } from 're-reselect';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectModerationBlockList } from 'redux/selectors/comments';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { isURIEqual } from 'util/lbryURI';

const selectClaimExistsForUri = (state, uri) => {
  return Boolean(selectClaimForUri(state, uri));
};

const selectTxidForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const signingChannel = claim && claim.signing_channel;
  return signingChannel ? signingChannel.txid : claim ? claim.txid : undefined;
};

const selectNoutForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const signingChannel = claim && claim.signing_channel;
  return signingChannel ? signingChannel.nout : claim ? claim.nout : undefined;
};

const selectPermanentUrlForUri = (state, uri) => {
  const claim = selectClaimForUri(state, uri);
  const signingChannel = claim && claim.signing_channel;
  return signingChannel ? signingChannel.permanent_url : claim ? claim.permanent_url : undefined;
};

export const selectBanStateForUri = createCachedSelector(
  // Break apart 'selectClaimForUri' into 4 cheaper selectors that return
  // primitives for values that we care about. The Claim object itself is easily
  // invalidated due to constantly-changing fields like 'confirmation'.
  selectClaimExistsForUri,
  selectTxidForUri,
  selectNoutForUri,
  selectPermanentUrlForUri,
  selectBlackListedOutpoints,
  selectFilteredOutpoints,
  selectMutedChannels,
  selectModerationBlockList,
  (
    claimExists,
    txid,
    nout,
    permanentUrl,
    blackListedOutpoints,
    filteredOutpoints,
    mutedChannelUris,
    personalBlocklist
  ) => {
    const banState = {};

    if (!claimExists) {
      return banState;
    }

    // This will be replaced once blocking is done at the wallet server level.
    if (blackListedOutpoints) {
      if (blackListedOutpoints.some((outpoint) => outpoint.txid === txid && outpoint.nout === nout)) {
        banState['blacklisted'] = true;
      }
    }

    // We're checking to see if the stream outpoint or signing channel outpoint
    // is in the filter list.
    if (filteredOutpoints) {
      if (filteredOutpoints.some((outpoint) => outpoint.txid === txid && outpoint.nout === nout)) {
        banState['filtered'] = true;
      }
    }

    // block stream claims
    // block channel claims if we can't control for them in claim search
    if (mutedChannelUris.length) {
      if (mutedChannelUris.some((blockedUri) => isURIEqual(blockedUri, permanentUrl))) {
        banState['muted'] = true;
      }
    }

    // Commentron blocklist
    if (personalBlocklist.length) {
      if (personalBlocklist.some((blockedUri) => isURIEqual(blockedUri, permanentUrl))) {
        banState['blocked'] = true;
      }
    }

    return banState;
  }
)((state, uri) => String(uri));
