import { connect } from 'react-redux';
import { selectSearchOptions, doUpdateSearchOptions } from 'lbry-redux';
import SearchOptions from './view';

const select = state => ({
  options: selectSearchOptions(state),
});

const perform = dispatch => ({
  setSearchOption: (option, value) => dispatch(doUpdateSearchOptions({ [option]: value })),
});

export default connect(
  select,
  perform
)(SearchOptions);
