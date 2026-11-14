//@ts-nocheck
import { connect } from "react-redux";
import { doSetDaemonSetting } from "redux/actions/settings";
import { selectDaemonSettings } from "redux/selectors/settings";
import MaxPurchasePrice from "./view";

const select = (state: unknown) => ({
  daemonSettings: selectDaemonSettings(state),
});
const perform = (dispatch: Dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
});

export default connect(select, perform)(MaxPurchasePrice);
