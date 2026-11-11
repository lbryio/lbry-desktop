//@ts-nocheck
import { connect } from "react-redux";
import { makeSelectClaimForUri } from "redux/selectors/claims";
import VideoDuration from "./view";

const select = (state: unknown, props: unknown) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select, null)(VideoDuration);
