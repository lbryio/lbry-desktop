//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import { selectTransactionItems } from "redux/selectors/wallet";
import ModalSupportsLiquidate from "./view";

const select = (state: unknown) => ({
  transactionItems: selectTransactionItems(state),
});

const perform = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(select, perform)(ModalSupportsLiquidate);
