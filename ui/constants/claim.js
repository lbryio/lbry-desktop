// @flow
import { MATURE_TAGS } from 'constants/tags';
export const MINIMUM_PUBLISH_BID = 0.0001;
export const ESTIMATED_FEE = 0.048; // .001 + .001 | .048 + .048 = .1

export const MY_CLAIMS_PAGE_SIZE = 10;
export const PAGE_PARAM = 'page';
export const PAGE_SIZE_PARAM = 'page_size';
export const CHANNEL_ANONYMOUS = 'anonymous';
export const CHANNEL_NEW = 'new';
export const PAGE_SIZE = 20;

export const LEVEL_1_STAKED_AMOUNT = 0;
export const LEVEL_2_STAKED_AMOUNT = 1;
export const LEVEL_3_STAKED_AMOUNT = 50;
export const LEVEL_4_STAKED_AMOUNT = 250;
export const LEVEL_5_STAKED_AMOUNT = 1000;
export const INVALID_NAME_ERROR =
  __('LBRY names cannot contain spaces or reserved symbols') + ' ' + '(?$#@;:/\\="<>%{}|^~[]`)';

export const FORCE_CONTENT_TYPE_PLAYER = [
  'video/quicktime',
  'application/x-ext-mkv',
  'video/x-matroska',
  'video/x-ms-wmv',
  'video/x-msvideo',
  'video/mpeg',
  'video/m4v',
  'audio/ogg',
  'application/x-ext-ogg',
  'application/x-ext-m4a',
];

export const FORCE_CONTENT_TYPE_COMIC = [
  'application/vnd.comicbook+zip',
  'application/vnd.comicbook-rar',
  'application/x-cbr',
  'application/x-cbt',
  'application/x-cbz',
  'application/x-cb7',
];

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
