//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import ModalSendTip from "./view";

const perform = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalSendTip);
