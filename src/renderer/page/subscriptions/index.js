import React from "react";
import { connect } from "react-redux";
import {
  selectSubscriptionsFromClaims,
  selectSubscriptions,
  selectHasFetchedSubscriptions
} from "redux/selectors/subscriptions";
import { doFetchClaimsByChannel } from "redux/actions/content";
import { setHasFetchedSubscriptions } from "redux/actions/subscriptions";
import SubscriptionsPage from "./view";

const select = state => ({
  hasFetchedSubscriptions:  state.subscriptions.hasFetchedSubscriptions,
  savedSubscriptions: selectSubscriptions(state),
  subscriptions: selectSubscriptionsFromClaims(state),
})

export default connect(select, {
  doFetchClaimsByChannel,
  setHasFetchedSubscriptions
})(SubscriptionsPage);
