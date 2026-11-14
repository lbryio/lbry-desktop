//@ts-nocheck
import { connect } from "react-redux";
import { makeSelectClaimForUri, makeSelectContentTypeForUri } from "redux/selectors/claims";
import AppViewer from "./view";

const select = (state: unknown, props: unknown) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
});

const perform = (dispatch: Dispatch) => ({});

export default connect(select, perform)(AppViewer);
