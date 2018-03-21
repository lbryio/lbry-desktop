import React from 'react';
import { connect } from 'react-redux';
import { selectUserHistory } from 'redux/selectors/user';
import { doNavigate } from 'redux/actions/navigation';
import UserHistoryPage from './view';

const select = state => ({
  history: selectUserHistory(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(UserHistoryPage);
