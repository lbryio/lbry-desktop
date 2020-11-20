import { connect } from 'react-redux';
import { doFocusSearchInput, doBlurSearchInput, doUpdateSearchQuery } from 'redux/actions/search';
import { selectSearchValue, selectSearchSuggestions, selectSearchBarFocused } from 'redux/selectors/search';
import { selectLanguage } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import analytics from 'analytics';
import Wunderbar from './view';
import { withRouter } from 'react-router-dom';

const select = state => ({
  suggestions: selectSearchSuggestions(state),
  searchQuery: selectSearchValue(state),
  isFocused: selectSearchBarFocused(state),
  language: selectLanguage(state),
});

const perform = (dispatch, ownProps) => ({
  doSearch: query => {
    let encodedQuery = encodeURIComponent(query);
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodedQuery}` });
    dispatch(doUpdateSearchQuery(query));
    analytics.apiLogSearch();
  },
  navigateToUri: uri => {
    ownProps.history.push(uri);
  },
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doShowSnackBar: message => dispatch(doToast({ isError: true, message })),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default withRouter(connect(select, perform)(Wunderbar));
