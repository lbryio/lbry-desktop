import SettingEnablePrereleases from './view';
import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSetClientSetting } from 'redux/actions/settings';

const select = (state) => {
  return {
    enablePrereleases: makeSelectClientSetting(SETTINGS.ENABLE_PRERELEASE_UPDATES)(state),
  };
};

const perform = (dispatch) => ({
  setClientSetting: (value) => dispatch(doSetClientSetting(SETTINGS.ENABLE_PRERELEASE_UPDATES, value)),
});

export default connect(select, perform)(SettingEnablePrereleases);
