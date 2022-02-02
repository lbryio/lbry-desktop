// @flow
import { MATURE_TAGS } from 'constants/tags';
import { parseURI } from 'util/lbryURI';

const matureTagMap = MATURE_TAGS.reduce((acc, tag) => ({ ...acc, [tag]: true }), {});

export const isClaimNsfw = (claim: Claim): boolean => {
  if (!claim) {
    throw new Error('No claim passed to isClaimNsfw()');
  }

  if (!claim.value) {
    return false;
  }

  const tags = claim.value.tags || [];
  for (let i = 0; i < tags.length; i += 1) {
    const tag = tags[i].toLowerCase();
    if (matureTagMap[tag]) {
      return true;
    }
  }

  return false;
};

export function createNormalizedClaimSearchKey(options: { page: number, release_time?: string }) {
  // Ignore page because we don't care what the last page searched was, we want everything
  // Ignore release_time because that will change depending on when you call claim_search ex: release_time: ">12344567"
  const { page: optionToIgnoreForQuery, release_time: anotherToIgnore, ...rest } = options;
  const query = JSON.stringify(rest);
  return query;
}

export function concatClaims(claimList: Array<Claim> = [], concatClaimList: Array<any> = []): Array<Claim> {
  if (!claimList || claimList.length === 0) {
    if (!concatClaimList) {
      return [];
    }
    return concatClaimList.slice();
  }

  const claims = claimList.slice();
  concatClaimList.forEach((claim) => {
    if (!claims.some((item) => item.claim_id === claim.claim_id)) {
      claims.push(claim);
    }
  });

  return claims;
}

export function filterClaims(claims: Array<Claim>, query: ?string): Array<Claim> {
  if (query) {
    const queryMatchRegExp = new RegExp(query, 'i');
    return claims.filter((claim) => {
      const { value } = claim;

      return (
        (value.title && value.title.match(queryMatchRegExp)) ||
        (claim.signing_channel && claim.signing_channel.name.match(queryMatchRegExp)) ||
        (claim.name && claim.name.match(queryMatchRegExp))
      );
    });
  }

  return claims;
}

/**
 * Determines if the claim is a channel.
 *
 * @param claim
 * @param uri An abandoned claim will be null, so provide the `uri` as a fallback to parse.
 */
export function isChannelClaim(claim: ?Claim, uri?: string) {
  // 1. parseURI can't resolve a repost's channel, so a `claim` will be needed.
  // 2. parseURI is still needed to cover the case of abandoned claims.
  if (claim) {
    return claim.value_type === 'channel';
  } else if (uri) {
    try {
      return Boolean(parseURI(uri).isChannel);
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
}

export function getChannelIdFromClaim(claim: ?Claim) {
  if (claim) {
    if (claim.value_type === 'channel') {
      return claim.claim_id;
    } else if (claim.signing_channel) {
      return claim.signing_channel.claim_id;
    }
  }
}

export function getChannelNameFromClaim(claim: ?Claim) {
  const channelFromClaim = getChannelFromClaim(claim);
  return channelFromClaim && channelFromClaim.name;
}

export function getChannelFromClaim(claim: ?Claim) {
  return !claim
    ? null
    : claim.value_type === 'channel'
    ? claim
    : claim.signing_channel && claim.is_channel_signature_valid
    ? claim.signing_channel
    : null;
}

export function getClaimMetadata(claim: ?Claim) {
  const metadata = claim && claim.value;
  return metadata || (claim === undefined ? undefined : null);
}

export function getClaimTitle(claim: ?Claim) {
  const metadata = getClaimMetadata(claim);
  return metadata && metadata.title;
}
