//@ts-nocheck
import { connect } from "react-redux";
import { doOpenModal } from "redux/actions/app";
import ZoomableImage from "./view";

const perform = (dispatch: unknown) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(null, perform)(ZoomableImage);
