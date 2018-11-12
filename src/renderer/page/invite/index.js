import { connect } from 'react-redux';
import {
  doFetchInviteStatus,
  selectUserInviteStatusFailed,
  selectUserInviteStatusIsPending,
} from 'lbryinc';
import InvitePage from './view';

const select = state => ({
  isFailed: selectUserInviteStatusFailed(state),
  isPending: selectUserInviteStatusIsPending(state),
});

const perform = dispatch => ({
  fetchInviteStatus: () => dispatch(doFetchInviteStatus()),
});

export default connect(
  select,
  perform
)(InvitePage);
