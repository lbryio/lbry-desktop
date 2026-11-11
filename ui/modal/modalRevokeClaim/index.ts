//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import { doAbandonTxo, doAbandonClaim, doResolveUri } from "redux/actions/claims";
import { doToast } from "redux/actions/notifications";
import ModalRevokeClaim from "./view";
import { selectTransactionItems } from "redux/selectors/wallet";

const select = (state: unknown) => ({
  transactionItems: selectTransactionItems(state),
});

const perform = (dispatch: Dispatch) => ({
  toast: (message, isError) => dispatch(doToast({ message, isError })),
  closeModal: () => dispatch(doHideModal()),
  abandonTxo: (txo, cb) => dispatch(doAbandonTxo(txo, cb)),
  abandonClaim: (claim, cb) => dispatch(doAbandonClaim(claim, cb)),
  doResolveUri: (uri) => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(ModalRevokeClaim);
