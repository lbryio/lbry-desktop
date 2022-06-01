import { connect } from 'react-redux';
import { doSetDaemonSetting, doGetDaemonStatus, doCleanBlobs } from 'redux/actions/settings';
import { selectViewHostingLimit, selectViewBlobSpace, selectSettingDaemonSettings } from 'redux/selectors/settings';
import SettingViewHosting from './view';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  viewHostingLimit: selectViewHostingLimit(state),
  viewBlobSpace: selectViewBlobSpace(state),
  diskSpace: selectDiskSpace(state),
  isSetting: selectSettingDaemonSettings(state),
});

const perform = (dispatch) => ({
  getDaemonStatus: () => dispatch(doGetDaemonStatus()),
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
  cleanBlobs: () => dispatch(doCleanBlobs()),
});

export default connect(select, perform)(SettingViewHosting);
