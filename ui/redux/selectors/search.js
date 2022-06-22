// @flow
import { selectShowMatureContent } from 'redux/selectors/settings';
import {
  selectClaimsByUri,
  selectClaimForClaimId,
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
import { createNormalizedSearchKey, getRecommendationSearchKey, getRecommendationSearchOptions } from 'util/search';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectHistory } from 'redux/selectors/content';
import { selectAllCostInfoByUri } from 'lbryinc';

type State = { claims: any, search: SearchState, user: UserState };

export const selectState = (state: State): SearchState => state.search;

// $FlowFixMe - 'searchQuery' is never populated. Something lost in a merge?
export const selectSearchValue: (state: State) => string = (state) => selectState(state).searchQuery;
export const selectSearchOptions: (state: State) => SearchOptions = (state) => selectState(state).options;
export const selectIsSearching: (state: State) => boolean = (state) => selectState(state).searching;
export const selectSearchResultByQuery = (state: State) => selectState(state).resultsByQuery;
export const selectHasReachedMaxResultsLength: (state: State) => { [boolean]: Array<boolean> } = (state) =>
  selectState(state).hasReachedMaxResultsLength;
export const selectMentionSearchResults: (state: State) => Array<string> = (state) => selectState(state).results;
export const selectMentionQuery: (state: State) => string = (state) => selectState(state).mentionQuery;
export const selectPersonalRecommendations = (state: State) => selectState(state).personalRecommendations;

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

export const selectRecommendedContentRawForUri = createCachedSelector(
  (state, uri) => uri,
  selectClaimsByUri,
  selectShowMatureContent,
  selectClaimIsNsfwForUri, // (state, uri)
  selectSearchResultByQuery,
  (uri, claimsByUri, matureEnabled, isMature, searchUrisByQuery) => {
    const claim = claimsByUri[uri];
    if (claim?.value?.title) {
      const options = getRecommendationSearchOptions(matureEnabled, isMature, claim.claim_id);
      const normalizedSearchQuery = getRecommendationSearchKey(claim.value.title, options);
      return searchUrisByQuery[normalizedSearchQuery];
    }
    return undefined;
  }
)((state, uri) => String(uri));

export const selectRecommendedContentForUri = createCachedSelector(
  (state, uri) => uri,
  selectHistory,
  selectRecommendedContentRawForUri, // (state, uri)
  selectClaimsByUri,
  selectMutedChannels,
  selectAllCostInfoByUri,
  (uri, history, rawRecommendations, claimsByUri, blockedChannels, costInfoByUri) => {
    const claim = claimsByUri[uri];
    if (!claim) return;

    let recommendedContent;
    // always grab the claimId - this value won't change for filtering
    const currentClaimId = claim.claim_id;

    const searchResult = rawRecommendations;

    if (searchResult) {
      // Filter from recommended: The same claim and blocked channels
      recommendedContent = searchResult['uris'].filter((searchUri) => {
        const searchClaim = claimsByUri[searchUri];

        if (!searchClaim) {
          return true;
        }

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
      for (let i = 0; i < recommendedContent.length; ++i) {
        const nextRecommendedUri = recommendedContent[i];
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

        if (!historyMatch && costInfo === 0 && (isVideo || isAudio)) {
          // Better next-uri found, swap with top entry:
          if (i > 0) {
            const a = recommendedContent[0];
            recommendedContent[0] = nextRecommendedUri;
            recommendedContent[i] = a;
          }
          break;
        }
      }
    }

    return recommendedContent;
  }
)((state, uri) => String(uri));

export const selectRecommendedMetaForClaimId = createCachedSelector(
  selectClaimForClaimId,
  selectShowMatureContent,
  selectSearchResultByQuery,
  (claim, matureEnabled, searchUrisByQuery) => {
    if (claim && claim?.value?.title && claim.claim_id) {
      const isMature = isClaimNsfw(claim);
      const title = claim.value.title;

      const options = getRecommendationSearchOptions(matureEnabled, isMature, claim.claim_id);
      const normalizedSearchQuery = getRecommendationSearchKey(title, options);

      const searchResult = searchUrisByQuery[normalizedSearchQuery];
      if (searchResult) {
        return {
          poweredBy: searchResult.recsys,
          uuid: searchResult.uuid,
        };
      } else {
        return normalizedSearchQuery;
      }
    }
  }
)((state, claimId) => String(claimId));

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
