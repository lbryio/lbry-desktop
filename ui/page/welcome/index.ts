//@ts-nocheck
import { connect } from "react-redux";
import Welcome from "./view";
import { doSetWelcomeVersion } from "redux/actions/app";
import { WELCOME_VERSION } from "config";
import { selectDaemonSettings, selectDaemonStatus } from "redux/selectors/settings";

const select = (state: unknown) => ({
  daemonSettings: selectDaemonSettings(state),
  daemonStatus: selectDaemonStatus(state),
});

const perform = (dispatch: Dispatch) => ({
  updateWelcomeVersion: (version) => dispatch(doSetWelcomeVersion(version || WELCOME_VERSION)),
});

export default connect(select, perform)(Welcome);
