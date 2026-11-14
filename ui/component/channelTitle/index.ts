//@ts-nocheck
import { connect } from "react-redux";
import { makeSelectClaimForUri, selectTitleForUri } from "redux/selectors/claims";
import ChannelTitle from "./view";

const select = (state: unknown, props: unknown) => ({
  title: selectTitleForUri(state, props.uri),
  claim: makeSelectClaimForUri(props.uri)(state),
});

export default connect(select)(ChannelTitle);
