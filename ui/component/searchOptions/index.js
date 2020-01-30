import { connect } from 'react-redux';
import { selectSearchOptions, doUpdateSearchOptions, makeSelectQueryWithOptions } from 'lbry-redux';
import { doToggleSearchExpanded } from 'redux/actions/app';
import { selectSearchOptionsExpanded } from 'redux/selectors/app';
import SearchOptions from './view';

const select = state => ({
  options: selectSearchOptions(state),
  expanded: selectSearchOptionsExpanded(state),
  query: makeSelectQueryWithOptions()(state),
});

const perform = (dispatch, ownProps) => {
  const additionalOptions = ownProps.additionalOptions || {};
  return {
    setSearchOption: (option, value) => dispatch(doUpdateSearchOptions({ [option]: value }, additionalOptions)),
    toggleSearchExpanded: () => dispatch(doToggleSearchExpanded()),
  };
};

export default connect(
  select,
  perform
)(SearchOptions);
