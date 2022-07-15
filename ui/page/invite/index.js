import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  selectUserInviteStatusFailed,
  selectUserInviteStatusIsPending,
  selectUserVerifiedEmail,
} from 'redux/selectors/user';
import { doFetchInviteStatus } from 'redux/actions/user';
import { selectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import InvitePage from './view';

const select = (state) => ({
  isFailed: selectUserInviteStatusFailed(state),
  isPending: selectUserInviteStatusIsPending(state),
  inviteAcknowledged: selectClientSetting(state, SETTINGS.INVITE_ACKNOWLEDGED),
  authenticated: selectUserVerifiedEmail(state),
});

const perform = (dispatch) => ({
  fetchInviteStatus: (callRewardList) => dispatch(doFetchInviteStatus(callRewardList)),
  acknowledgeInivte: () => dispatch(doSetClientSetting(SETTINGS.INVITE_ACKNOWLEDGED, true)),
});

export default connect(select, perform)(InvitePage);
