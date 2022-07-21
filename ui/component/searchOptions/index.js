import { connect } from 'react-redux';
import { doUpdateSearchOptions } from 'redux/actions/search';
import { selectSearchOptions } from 'redux/selectors/search';
import { doToggleSearchExpanded } from 'redux/actions/app';
import { selectSearchOptionsExpanded } from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';
import SearchOptions from './view';

const select = (state) => ({
  options: selectSearchOptions(state),
  expanded: selectSearchOptionsExpanded(state),
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
});

const perform = (dispatch, ownProps) => {
  const additionalOptions = ownProps.additionalOptions || {};
  return {
    setSearchOption: (option, value) => dispatch(doUpdateSearchOptions({ [option]: value }, additionalOptions)),
    toggleSearchExpanded: () => dispatch(doToggleSearchExpanded()),
  };
};

export default connect(select, perform)(SearchOptions);
