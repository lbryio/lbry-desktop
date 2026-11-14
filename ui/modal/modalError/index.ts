//@ts-nocheck
import { connect } from "react-redux";
import { doDismissError } from "redux/actions/notifications";
import ModalError from "./view";

const perform = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(doDismissError()),
});

export default connect(null, perform)(ModalError);
