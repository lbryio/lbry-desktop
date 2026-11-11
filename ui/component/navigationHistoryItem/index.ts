//@ts-nocheck
import { connect } from "react-redux";
import { doResolveUri } from "redux/actions/claims";
import { makeSelectClaimForUri } from "redux/selectors/claims";
import UserHistoryItem from "./view";

const select = (state: unknown, props: unknown) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = (dispatch: Dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(UserHistoryItem);
