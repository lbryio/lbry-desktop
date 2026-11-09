// Searches through lbry-search's GraphQL API (https://github.com/bitcoinbrisbane/lbry-search).
//
// The app builds Lighthouse query strings in several places (util/query-params, channel search),
// so this takes the same string and answers in the same shape as handleFetchResponse:
// { body: [{ name, claimId }], poweredBy }. Options lbry-search doesn't filter on yet (mature
// content, free only, release time, related_to) are applied to each page here, so a page can
// come back short; hasNextPage tells the caller whether there's more.
import {SEARCH_OPTIONS} from 'constants/search';
import { MATURE_TAGS } from 'constants/tags';

const MAX_PAGE = 100; // lbry-search's largest page

// `channel` is newer than the other arguments (bitcoinbrisbane/lbry-search#2) and a server
// without it rejects any query that names it, so it's only in the query for channel searches.
function searchQuery(inChannel: boolean) {
  const channelVar = inChannel ? ', $channel: ID' : '';
  const channelArg = inChannel ? ', channel: $channel' : '';
  return `query Search($text: String!, $first: Int, $after: String, $type: ClaimType, $mediaType: String${channelVar}) {
  search(text: $text, first: $first, after: $after, type: $type, mediaType: $mediaType${channelArg}) {
    nodes { id name tags releaseTime fee { amount } }
    pageInfo { hasNextPage }
  }
}`;
}

const HOUR = 60 * 60;
const TIME_FILTER_SECONDS: {
  [key: string]: number
} = {
  [SEARCH_OPTIONS.TIME_FILTER_LAST_HOUR]: HOUR,
  [SEARCH_OPTIONS.TIME_FILTER_TODAY]: 24 * HOUR,
  [SEARCH_OPTIONS.TIME_FILTER_THIS_WEEK]: 7 * 24 * HOUR,
  [SEARCH_OPTIONS.TIME_FILTER_THIS_MONTH]: 30 * 24 * HOUR,
  [SEARCH_OPTIONS.TIME_FILTER_THIS_YEAR]: 365 * 24 * HOUR,
};

const MATURE = new Set(MATURE_TAGS);

type Node = {
  id: string,
  name: string,
  tags: Array<string>,
  releaseTime: number | null | undefined,
  fee: {
    amount: string
  } | null | undefined
};

// lbry-search's cursors are base64url("s:<offset of the last item>"), so the page starting at
// `from` follows the cursor for `from - 1`.
function cursorBefore(from: number): string | null | undefined {
  if (from <= 0) return null;
  return btoa(`s:${from - 1}`)
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function claimType(lighthouseType?: string | null): string | null | undefined {
  if (lighthouseType === SEARCH_OPTIONS.INCLUDE_FILES) return 'STREAM';
  if (lighthouseType === SEARCH_OPTIONS.INCLUDE_CHANNELS) return 'CHANNEL';
  return null; // both, or not given
}

// lbry-search takes one media type; with several selected, don't filter.
function mediaType(lighthouseTypes?: string | null): string | null | undefined {
  const types = (lighthouseTypes || '').split(',').filter(Boolean);
  return types.length === 1 ? types[0] : null;
}

export default function lbrySearch(endpoint: string, queryString: string) {
  const params = new URLSearchParams(queryString);
  const text = (params.get('s') || '').replace(/^"(.*)"$/, '$1'); // every word is required anyway
  const size = Number(params.get('size')) || 20;
  const from = Number(params.get('from')) || 0;
  const relatedTo = params.get(SEARCH_OPTIONS.RELATED_TO);
  const hideMature = params.get(SEARCH_OPTIONS.INCLUDE_MATURE) === 'false';
  const freeOnly = params.get(SEARCH_OPTIONS.PRICE_FILTER_FREE) === 'true';
  const maxAge = TIME_FILTER_SECONDS[params.get(SEARCH_OPTIONS.TIME_FILTER) || ''];
  const releasedAfter = maxAge ? Date.now() / 1000 - maxAge : 0;

  const channel = params.get('channel_id');
  const variables = {
    text,
    first: Math.min(size, MAX_PAGE),
    after: cursorBefore(from),
    type: claimType(params.get(SEARCH_OPTIONS.CLAIM_TYPE)),
    mediaType: mediaType(params.get('mediaType')),
    ...(channel ? { channel } : {}),
  } as const;

  const keep = (node: Node) =>
    node.id !== relatedTo &&
// @ts-expect-error - TS2345 - Argument of type 'string' is not assignable to parameter of type '"porn" | "porno" | "nsfw" | "mature" | "xxx" | "sex" | "creampie" | "blowjob" | "handjob" | "vagina" | "boobs" | "big boobs" | "big dick" | "pussy" | "cumshot" | "anal" | "hard fucking" | "ass" | "fuck" | "hentai"'.
    !(hideMature && node.tags.some((tag) => MATURE.has(tag.toLowerCase()))) &&
    !(freeOnly && node.fee) &&
    !(releasedAfter && (node.releaseTime || 0) < releasedAfter);

  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: searchQuery(Boolean(channel)), variables }),
  })
    .then((response) => {
      if (response.status !== 200) throw new Error(response.statusText);
      return response.json();
    })
    .then(({ data, errors }) => {
      if (errors && errors.length) throw new Error(errors[0].message);
      const { nodes, pageInfo } = data.search;
      return {
        body: nodes.filter(keep).map((node) => ({ name: node.name, claimId: node.id })),
        poweredBy: 'lbry-search',
        hasNextPage: pageInfo.hasNextPage,
      };
    });
}
