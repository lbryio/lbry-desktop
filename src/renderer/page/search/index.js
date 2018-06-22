import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { selectIsSearching, makeSelectCurrentParam, doUpdateSearchQuery } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { doNavigate } from 'redux/actions/navigation';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
  query: makeSelectCurrentParam('query')(state),
  showUnavailable: makeSelectClientSetting(settings.SHOW_UNAVAILABLE)(state),
  resultCount: makeSelectClientSetting(settings.RESULT_COUNT)(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(SearchPage);
