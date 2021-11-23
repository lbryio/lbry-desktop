import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import SettingCommentsServer from './view';

const select = (state) => ({
  customServerEnabled: selectClientSetting(state, SETTINGS.CUSTOM_COMMENTS_SERVER_ENABLED),
  customServerUrl: selectClientSetting(state, SETTINGS.CUSTOM_COMMENTS_SERVER_URL),
});

const perform = (dispatch) => ({
  setCustomServerEnabled: (val) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_ENABLED, val, true)),
  setCustomServerUrl: (url) => dispatch(doSetClientSetting(SETTINGS.CUSTOM_COMMENTS_SERVER_URL, url, true)),
});

export default connect(select, perform)(SettingCommentsServer);
