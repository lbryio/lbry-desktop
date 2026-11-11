//@ts-nocheck
import { connect } from "react-redux";
import ModalPasswordUnsave from "./view";
import { doHideModal } from "redux/actions/app";

const perform = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalPasswordUnsave);
