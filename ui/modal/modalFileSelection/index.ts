//@ts-nocheck
import { connect } from "react-redux";
import { doHideModal } from "redux/actions/app";
import { doUpdatePublishForm } from "redux/actions/publish";

import ModaFileSelection from "./view";

const perform = (dispatch: unknown) => ({
  hideModal: (props) => dispatch(doHideModal(props)),
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(null, perform)(ModaFileSelection);
