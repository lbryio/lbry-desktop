import { connect } from 'react-redux';
import { doUpdateSearchOptions } from 'redux/actions/search';
import { selectSearchOptions, makeSelectQueryWithOptions } from 'redux/selectors/search';
import { doToggleSearchExpanded } from 'redux/actions/app';
import { selectSearchOptionsExpanded } from 'redux/selectors/app';
import SearchOptions from './view';
import { selectTheme } from 'redux/selectors/settings';

const select = (state) => ({
  options: selectSearchOptions(state),
  expanded: selectSearchOptionsExpanded(state),
  query: makeSelectQueryWithOptions(undefined, {})(state),
  theme: selectTheme(state),
});

const perform = (dispatch, ownProps) => {
  const additionalOptions = ownProps.additionalOptions || {};
  return {
    setSearchOption: (option, value) => dispatch(doUpdateSearchOptions({ [option]: value }, additionalOptions)),
    toggleSearchExpanded: () => dispatch(doToggleSearchExpanded()),
  };
};

export default connect(select, perform)(SearchOptions);
