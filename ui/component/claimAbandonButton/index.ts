//@ts-nocheck
import { connect } from "react-redux";
import { doOpenModal } from "redux/actions/app";
import ClaimAbandonButton from "./view";

import { makeSelectClaimForUri } from "redux/selectors/claims";

const select = (state: unknown, props: unknown) => ({
  claim: props.uri && makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, {
  doOpenModal,
})(ClaimAbandonButton);
