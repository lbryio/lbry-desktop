import React from "react";
import { connect } from "react-redux";
import {
  selectUserInvitesRemaining,
  selectUserInviteNewIsPending,
} from "selectors/user";
import InviteSummary from "./view";

const select = state => ({
  invitesRemaining: selectUserInvitesRemaining(state),
  isPending: selectUserInviteNewIsPending(state),
});

export default connect(select)(InviteSummary);
