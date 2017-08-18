import React from "react";
import { connect } from "react-redux";
import InviteNew from "./view";
import {
  selectUserInvitesRemaining,
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
} from "selectors/user";
import { doUserInviteNew } from "actions/user";

const select = state => ({
  errorMessage: selectUserInviteNewErrorMessage(state),
  invitesRemaining: selectUserInvitesRemaining(state),
  isPending: selectUserInviteNewIsPending(state),
});

const perform = dispatch => ({
  inviteNew: email => dispatch(doUserInviteNew(email)),
});

export default connect(select, perform)(InviteNew);
