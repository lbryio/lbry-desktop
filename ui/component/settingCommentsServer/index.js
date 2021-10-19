import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingCommentsServer from './view';

const select = (state) => ({
  customServerEnabled: makeSelectClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_ENABLED)(state),
  customServerUrl: makeSelectClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_URL)(state),
});

const perform = (dispatch) => ({
  setCustomServerEnabled: (val) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_ENABLED, val, true)),
  setCustomServerUrl: (url) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_URL, url, true)),
});

export default connect(select, perform)(SettingCommentsServer);
