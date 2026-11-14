//@ts-nocheck
import { connect } from "react-redux";
import * as SETTINGS from "constants/settings";
import { doSetClientSetting } from "redux/actions/settings";
import { selectClientSetting } from "redux/selectors/settings";
import SettingDownloadOrganization from "./view";

const select = (state: unknown) => ({
  byChannel: selectClientSetting(state, SETTINGS.DOWNLOAD_BY_CHANNEL),
  fileNaming: selectClientSetting(state, SETTINGS.DOWNLOAD_FILE_NAMING),
});

const perform = (dispatch: Dispatch) => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(select, perform)(SettingDownloadOrganization);
