import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetDefaultVideoQuality } from 'redux/actions/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import SettingDefaultQuality from './view';

const select = (state) => ({
  defaultQuality: selectClientSetting(state, SETTINGS.DEFAULT_VIDEO_QUALITY),
});

const perform = {
  doSetDefaultVideoQuality,
};

export default connect(select, perform)(SettingDefaultQuality);
