import React from 'react';
import { connect } from 'react-redux';
import { selectIsSearching, selectSearchValue } from 'redux/selectors/search';
import { doNavigate } from 'redux/actions/navigation';
import { doUpdateSearchQuery } from 'redux/actions/search';
import SearchPage from './view';

const select = state => ({
  isSearching: selectIsSearching(state),
  query: selectSearchValue(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  updateSearchQuery: query => dispatch(doUpdateSearchQuery(query)),
});

export default connect(select, perform)(SearchPage);
