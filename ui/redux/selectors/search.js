// @flow
import { getSearchQueryString } from 'util/query-params';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { SEARCH_OPTIONS } from 'constants/search';
import {
  selectClaimsByUri,
  makeSelectClaimForUri,
  makeSelectClaimForClaimId,
  selectClaimIsNsfwForUri,
  makeSelectPendingClaimForUri,
  selectIsUriResolving,
} from 'redux/selectors/claims';
import { parseURI } from 'util/lbryURI';
import { isClaimNsfw } from 'util/claim';
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { createNormalizedSearchKey, getRecommendationSearchOptions } from 'util/search';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectHistory } from 'redux/selectors/content';
import { selectAllCostInfoByUri } from 'lbryinc';
import { SIMPLE_SITE } from 'config';

type State = { claims: any, search: SearchState };

export const selectState = (state: State): SearchState => state.search;

// $FlowFixMe - 'searchQuery' is never populated. Something lost in a merge?
export const selectSearchValue: (state: State) => string = (state) => selectState(state).searchQuery;
export const selectSearchOptions: (state: State) => SearchOptions = (state) => selectState(state).options;
export const selectIsSearching: (state: State) => boolean = (state) => selectState(state).searching;
export const selectSearchResultByQuery: (state: State) => { [string]: Array<string> } = (state) =>
  selectState(state).resultsByQuery;
export const selectHasReachedMaxResultsLength: (state: State) => { [boolean]: Array<boolean> } = (state) =>
  selectState(state).hasReachedMaxResultsLength;
export const selectSearchResults: (state: State) => Array<string> = (state) => selectState(state).results;

export const makeSelectSearchUrisForQuery = (query: string): ((state: State) => Array<string>) =>
  createSelector(selectSearchResultByQuery, (byQuery) => {
    if (!query) return;
    // replace statement below is kind of ugly, and repeated in doSearch action
    query = query.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
    const normalizedQuery = createNormalizedSearchKey(query);
    return byQuery[normalizedQuery] && byQuery[normalizedQuery]['uris'];
  });

export const makeSelectHasReachedMaxResultsLength = (query: string): ((state: State) => boolean) =>
  createSelector(selectHasReachedMaxResultsLength, (hasReachedMaxResultsLength) => {
    if (query) {
      query = query.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
      const normalizedQuery = createNormalizedSearchKey(query);
      return hasReachedMaxResultsLength[normalizedQuery];
    }
    return hasReachedMaxResultsLength[query];
  });

export const selectRecommendedContentForUri = createCachedSelector(
  (state, uri) => uri,
  selectHistory,
  selectClaimsByUri,
  selectShowMatureContent,
  selectMutedChannels,
  selectAllCostInfoByUri,
  selectSearchResultByQuery,
  selectClaimIsNsfwForUri, // (state, uri)
  (uri, history, claimsByUri, matureEnabled, blockedChannels, costInfoByUri, searchUrisByQuery, isMature) => {
    const claim = claimsByUri[uri];

    if (!claim) return;

    let recommendedContent;
    // always grab the claimId - this value won't change for filtering
    const currentClaimId = claim.claim_id;

    const { title } = claim.value;

    if (!title) return;

    const options: {
      size: number,
      nsfw?: boolean,
      isBackgroundSearch?: boolean,
    } = { size: 20, nsfw: matureEnabled, isBackgroundSearch: true };

    if (SIMPLE_SITE) {
      options[SEARCH_OPTIONS.CLAIM_TYPE] = SEARCH_OPTIONS.INCLUDE_FILES;
      options[SEARCH_OPTIONS.MEDIA_VIDEO] = true;
      options[SEARCH_OPTIONS.PRICE_FILTER_FREE] = true;
    }
    if (matureEnabled || (!matureEnabled && !isMature)) {
      options[SEARCH_OPTIONS.RELATED_TO] = claim.claim_id;
    }

    const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);
    const normalizedSearchQuery = createNormalizedSearchKey(searchQuery);

    let searchResult = searchUrisByQuery[normalizedSearchQuery];

    if (searchResult) {
      // Filter from recommended: The same claim and blocked channels
      recommendedContent = searchResult['uris'].filter((searchUri) => {
        const searchClaim = claimsByUri[searchUri];

        if (!searchClaim) return;

        const signingChannel = searchClaim && searchClaim.signing_channel;
        const channelUri = signingChannel && signingChannel.canonical_url;
        const blockedMatch = blockedChannels.some((blockedUri) => blockedUri.includes(channelUri));

        let isEqualUri;
        try {
          const { claimId: searchId } = parseURI(searchUri);
          isEqualUri = searchId === currentClaimId;
        } catch (e) {}

        return !isEqualUri && !blockedMatch;
      });

      // Claim to play next: playable and free claims not played before in history
      const nextUriToPlay = recommendedContent.filter((nextRecommendedUri) => {
        const costInfo = costInfoByUri[nextRecommendedUri] && costInfoByUri[nextRecommendedUri].cost;
        const recommendedClaim = claimsByUri[nextRecommendedUri];
        const isVideo = recommendedClaim && recommendedClaim.value && recommendedClaim.value.stream_type === 'video';
        const isAudio = recommendedClaim && recommendedClaim.value && recommendedClaim.value.stream_type === 'audio';

        let historyMatch = false;
        try {
          const { claimId: nextRecommendedId } = parseURI(nextRecommendedUri);

          historyMatch = history.some(
            (historyItem) =>
              (claimsByUri[historyItem.uri] && claimsByUri[historyItem.uri].claim_id) === nextRecommendedId
          );
        } catch (e) {}

        return !historyMatch && costInfo === 0 && (isVideo || isAudio);
      })[0];

      const index = recommendedContent.indexOf(nextUriToPlay);
      if (index > 0) {
        const a = recommendedContent[0];
        recommendedContent[0] = nextUriToPlay;
        recommendedContent[index] = a;
      }
    }
    return recommendedContent;
  }
)((state, uri) => String(uri));

export const makeSelectRecommendedRecsysIdForClaimId = (claimId: string) =>
  createSelector(
    makeSelectClaimForClaimId(claimId),
    selectShowMatureContent,
    selectSearchResultByQuery,
    (claim, matureEnabled, searchUrisByQuery) => {
      // TODO: DRY this out.
      let poweredBy;
      if (claim && claimId) {
        const isMature = isClaimNsfw(claim);
        const { title } = claim.value;
        if (!title) {
          return;
        }

        const options = getRecommendationSearchOptions(matureEnabled, isMature, claimId);
        const searchQuery = getSearchQueryString(title.replace(/\//, ' '), options);
        const normalizedSearchQuery = createNormalizedSearchKey(searchQuery);

        const searchResult = searchUrisByQuery[normalizedSearchQuery];
        if (searchResult) {
          poweredBy = searchResult.recsys;
        } else {
          return normalizedSearchQuery;
        }
      }
      return poweredBy;
    }
  );

export const makeSelectWinningUriForQuery = (query: string) => {
  const uriFromQuery = `lbry://${query}`;

  let channelUriFromQuery = '';
  try {
    const { isChannel } = parseURI(uriFromQuery);
    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
    }
  } catch (e) {}

  return createSelector(
    selectShowMatureContent,
    makeSelectPendingClaimForUri(uriFromQuery),
    makeSelectClaimForUri(uriFromQuery),
    makeSelectClaimForUri(channelUriFromQuery),
    (matureEnabled, pendingClaim, claim1, claim2) => {
      const claim1Mature = claim1 && isClaimNsfw(claim1);
      const claim2Mature = claim2 && isClaimNsfw(claim2);
      let pendingAmount = pendingClaim && pendingClaim.amount;

      if (!claim1 && !claim2) {
        return undefined;
      } else if (!claim1 && claim2) {
        return matureEnabled ? claim2.canonical_url : claim2Mature ? undefined : claim2.canonical_url;
      } else if (claim1 && !claim2) {
        return matureEnabled
          ? claim1.repost_url || claim1.canonical_url
          : claim1Mature
          ? undefined
          : claim1.repost_url || claim1.canonical_url;
      }

      const effectiveAmount1 = claim1 && (claim1.repost_bid_amount || claim1.meta.effective_amount);
      // claim2 will never have a repost_bid_amount because reposts never start with "@"
      const effectiveAmount2 = claim2 && claim2.meta.effective_amount;

      if (!matureEnabled) {
        if (claim1Mature && !claim2Mature) {
          return claim2.canonical_url;
        } else if (claim2Mature && !claim1Mature) {
          return claim1.repost_url || claim1.canonical_url;
        } else if (claim1Mature && claim2Mature) {
          return undefined;
        }
      }

      const returnBeforePending =
        Number(effectiveAmount1) > Number(effectiveAmount2)
          ? claim1.repost_url || claim1.canonical_url
          : claim2.canonical_url;
      if (pendingAmount && pendingAmount > effectiveAmount1 && pendingAmount > effectiveAmount2) {
        return pendingAmount.permanent_url;
      } else {
        return returnBeforePending;
      }
    }
  );
};

export const selectIsResolvingWinningUri = (state: State, query: string = '') => {
  const uriFromQuery = `lbry://${query}`;
  let channelUriFromQuery;
  try {
    const { isChannel } = parseURI(uriFromQuery);
    if (!isChannel) {
      channelUriFromQuery = `lbry://@${query}`;
    }
  } catch (e) {}

  const claim1IsResolving = selectIsUriResolving(state, uriFromQuery);
  const claim2IsResolving = channelUriFromQuery ? selectIsUriResolving(state, channelUriFromQuery) : false;
  return claim1IsResolving || claim2IsResolving;
};

export const makeSelectUrlForClaimId = (claimId: string) =>
  createSelector(makeSelectClaimForClaimId(claimId), (claim) =>
    claim ? claim.canonical_url || claim.permanent_url : null
  );
