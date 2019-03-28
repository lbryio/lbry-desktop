import { connect } from 'react-redux';
import { doSearch, selectIsSearching } from 'lbry-redux';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
});

const perform = {
  doSearch,
};

export default connect(
  select,
  perform
)(SearchPage);
