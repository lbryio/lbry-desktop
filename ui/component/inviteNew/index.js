import { connect } from 'react-redux';
import {
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
  selectUserInviteReferralCode,
} from 'redux/selectors/user';
import { doUserInviteNew } from 'redux/actions/user';
import { selectMyChannelClaims } from 'redux/selectors/claims';
import InviteNew from './view';

const select = (state) => ({
  errorMessage: selectUserInviteNewErrorMessage(state),
  referralCode: selectUserInviteReferralCode(state),
  isPending: selectUserInviteNewIsPending(state),
  channels: selectMyChannelClaims(state),
});

const perform = (dispatch) => ({
  inviteNew: (email) => dispatch(doUserInviteNew(email)),
});

export default connect(select, perform)(InviteNew);
