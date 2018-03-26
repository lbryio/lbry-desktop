import React from 'react';
import { connect } from 'react-redux';
import { selectCurrentPage, selectHeaderLinks } from 'redux/selectors/navigation';
import { doNavigate } from 'redux/actions/navigation';
import { selectNotifications } from 'redux/selectors/subscriptions';
import SubHeader from './view';

const select = (state, props) => ({
  currentPage: selectCurrentPage(state),
  subLinks: selectHeaderLinks(state),
  notifications: selectNotifications(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(SubHeader);
