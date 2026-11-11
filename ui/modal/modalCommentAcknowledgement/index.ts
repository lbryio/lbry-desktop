//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import ModalCommentAcknowledgement from "./view";

const perform = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
});

export default connect(null, perform)(ModalCommentAcknowledgement);
