import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { doSearch } from 'redux/actions/search';
import {
  selectIsSearching,
  makeSelectSearchUrisForQuery,
  selectSearchOptions,
  makeSelectHasReachedMaxResultsLength,
} from 'redux/selectors/search';
import { selectClientSetting, selectLanguage, selectShowMatureContent } from 'redux/selectors/settings';
import { getSearchQueryString } from 'util/query-params';
import { selectUserHasOdyseePremiumPlus } from 'redux/selectors/memberships';
import SearchPage from './view';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => {
  const showMature = selectShowMatureContent(state);
  const urlParams = new URLSearchParams(props.location.search);
  const hasPremiumPlus = selectUserHasOdyseePremiumPlus(state);
  const languageSetting = selectLanguage(state);
  const searchInLanguage = selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE);

  let urlQuery = urlParams.get('q') || null;
  if (urlQuery) {
    urlQuery = urlQuery.replace(/^lbry:\/\//i, '').replace(/\//, ' ');
  }

  const searchOptions = {
    ...selectSearchOptions(state),
    isBackgroundSearch: false,
    nsfw: showMature,
    ...(searchInLanguage ? { language: languageSetting } : {}),
  };

  const query = getSearchQueryString(urlQuery, searchOptions);
  const uris = makeSelectSearchUrisForQuery(query)(state);
  const hasReachedMaxResultsLength = makeSelectHasReachedMaxResultsLength(query)(state);

  return {
    urlQuery,
    searchOptions,
    isSearching: selectIsSearching(state),
    uris: uris,
    hasReachedMaxResultsLength: hasReachedMaxResultsLength,
    hasPremiumPlus: hasPremiumPlus,
  };
};

const perform = (dispatch) => ({
  search: (query, options) => dispatch(doSearch(query, options)),
});

export default withRouter(connect(select, perform)(SearchPage));
