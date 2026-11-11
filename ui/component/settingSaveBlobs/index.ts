//@ts-nocheck
import { connect } from "react-redux";
import { doSetDaemonSetting, doGetDaemonStatus } from "redux/actions/settings";
import { selectDaemonSettings } from "redux/selectors/settings";
import SettingWalletServer from "./view";
import { selectDiskSpace } from "redux/selectors/app";

const select = (state: unknown) => ({
  daemonSettings: selectDaemonSettings(state),
  diskSpace: selectDiskSpace(state),
});

const perform = (dispatch: unknown) => ({
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
});

export default connect(select, perform)(SettingWalletServer);
