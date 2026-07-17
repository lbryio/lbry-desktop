import { connect } from 'react-redux';

import HostingSplash from './view';
import {
  selectViewBlobSpace,
  selectViewHostingLimit,
  selectAutoBlobSpace,
  selectAutoHostingLimit,
  selectSaveBlobs,
} from 'redux/selectors/settings';
import { doSetDaemonSetting } from 'redux/actions/settings';
import { selectDiskSpace } from 'redux/selectors/app';

const select = (state) => ({
  diskSpace: selectDiskSpace(state),
  viewHostingLimit: selectViewHostingLimit(state),
  autoHostingLimit: selectAutoHostingLimit(state),
  viewBlobSpace: selectViewBlobSpace(state),
  autoBlobSpace: selectAutoBlobSpace(state),
  saveBlobs: selectSaveBlobs(state),
});

const perform = (dispatch) => ({
  setDaemonSetting: (key, value) => dispatch(doSetDaemonSetting(key, value)),
});

export default connect(select, perform)(HostingSplash);
