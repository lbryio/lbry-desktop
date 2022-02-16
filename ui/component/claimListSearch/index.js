import { connect } from 'react-redux';
import { selectClaimsByUri } from 'redux/selectors/claims';
import {
  selectIsSearching,
  makeSelectSearchUrisForQuery,
  makeSelectHasReachedMaxResultsLength,
} from 'redux/selectors/search';
import { getSearchQueryString } from 'util/query-params';
import { doSearch } from 'redux/actions/search';
import ClaimListSearch from './view';
import { doFetchViewCount } from 'lbryinc';

const select = (state, props) => {
  const { searchKeyword, pageSize, claimId, showMature } = props;
  const channel_id = encodeURIComponent(claimId);
  const isBackgroundSearch = false;
  const searchOptions = showMature
    ? {
        channel_id,
        isBackgroundSearch,
      }
    : {
        channel_id,
        size: pageSize,
        nsfw: false,
        isBackgroundSearch,
      };

  const searchQueryString = getSearchQueryString(searchKeyword, searchOptions);
  const searchResult = makeSelectSearchUrisForQuery(searchQueryString)(state);
  const searchResultLastPageReached = makeSelectHasReachedMaxResultsLength(searchQueryString)(state);

  return {
    claimsByUri: selectClaimsByUri(state),
    loading: props.loading !== undefined ? props.loading : selectIsSearching(state),
    searchOptions,
    searchResult,
    searchResultLastPageReached,
  };
};

const perform = {
  doFetchViewCount,
  doSearch,
};

export default connect(select, perform)(ClaimListSearch);
