import React from 'react';
import { connect } from 'react-redux';
import InvitePage from './view';
import { doFetchInviteStatus } from 'redux/actions/user';
import {
  selectUserInviteStatusFailed,
  selectUserInviteStatusIsPending,
} from 'redux/selectors/user';

const select = state => ({
  isFailed: selectUserInviteStatusFailed(state),
  isPending: selectUserInviteStatusIsPending(state),
});

const perform = dispatch => ({
  fetchInviteStatus: () => dispatch(doFetchInviteStatus()),
});

export default connect(select, perform)(InvitePage);
