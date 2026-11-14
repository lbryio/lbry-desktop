//@ts-nocheck
import { connect } from "react-redux";

import { doResolveUri } from "redux/actions/claims";
import { selectBalance } from "redux/selectors/wallet";
import RepostPage from "./view";

const select = (state: unknown, props: unknown) => ({
  balance: selectBalance(state),
});

const perform = (dispatch: Dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(RepostPage);
