//@ts-nocheck
import { connect } from "react-redux";
import { doQuitAnyDaemon } from "redux/actions/app";
import ModalIncompatibleDaemon from "./view";

const perform = (dispatch: Dispatch) => ({
  quitAnyDaemon: () => dispatch(doQuitAnyDaemon()),
});

export default connect(null, perform)(ModalIncompatibleDaemon);
