import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { doFocusSearchInput, doBlurSearchInput, doUpdateSearchQuery } from 'redux/actions/search';
import { selectSearchValue, selectSearchSuggestions, selectSearchBarFocused } from 'redux/selectors/search';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import analytics from 'analytics';
import Wunderbar from './view';
import { withRouter } from 'react-router-dom';
import { formatLbryUrlForWeb } from 'util/url';

const select = state => ({
  suggestions: selectSearchSuggestions(state),
  searchQuery: selectSearchValue(state),
  isFocused: selectSearchBarFocused(state),
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
});

const perform = (dispatch, ownProps) => ({
  onSearch: query => {
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodeURIComponent(query)}` });
    dispatch(doUpdateSearchQuery(query));
    analytics.apiLogSearch();
  },
  onSubmit: uri => {
    const path = formatLbryUrlForWeb(uri);
    ownProps.history.push(path);
    dispatch(doUpdateSearchQuery(''));
  },
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  doShowSnackBar: message => dispatch(doToast({ isError: true, message })),
  doFocus: () => dispatch(doFocusSearchInput()),
  doBlur: () => dispatch(doBlurSearchInput()),
});

export default withRouter(connect(select, perform)(Wunderbar));
