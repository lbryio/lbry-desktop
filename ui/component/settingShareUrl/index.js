import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingShareUrl from './view';

const select = (state) => ({
  customShareUrlEnabled: makeSelectClientSetting(SETTINGS.CUSTOM_SHARE_URL_ENABLED)(state),
  customShareUrl: makeSelectClientSetting(SETTINGS.CUSTOM_SHARE_URL)(state),
});

const perform = (dispatch) => ({
  setCustomShareUrlEnabled: (val) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_SHARE_URL_ENABLED, val, true)),
  setCustomShareUrl: (url) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_SHARE_URL, url, true)),
});

export default connect(select, perform)(SettingShareUrl);
