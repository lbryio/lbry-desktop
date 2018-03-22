import React from 'react';
import { connect } from 'react-redux';
import { selectUserHistory } from 'redux/selectors/user';
import { doUserHistoryClearItem } from 'redux/actions/user';
import { doNavigate } from 'redux/actions/navigation';
import UserHistoryPage from './view';

const select = state => ({
  history: selectUserHistory(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  clear: uri => dispatch(doUserHistoryClearItem(uri))
});

export default connect(select, perform)(UserHistoryPage);
