import SettingDisableAutoUpdates from './view';
import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';

const select = (state) => {
  return {
    disableAutoUpdates: makeSelectClientSetting(SETTINGS.DISABLE_AUTO_UPDATES)(state),
  };
};

const perform = (dispatch) => ({
  setClientSetting: (value) => dispatch(doSetClientSetting(SETTINGS.DISABLE_AUTO_UPDATES, value)),
});

export default connect(select, perform)(SettingDisableAutoUpdates);
