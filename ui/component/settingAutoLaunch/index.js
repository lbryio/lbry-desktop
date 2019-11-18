import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetAutoLaunch } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doToast } from 'lbry-redux';
import SettingAutoLaunch from './view';

const select = state => ({
  autoLaunch: makeSelectClientSetting(SETTINGS.AUTO_LAUNCH)(state),
});

const perform = dispatch => ({
  showToast: options => dispatch(doToast(options)),
  setAutoLaunch: value => dispatch(doSetAutoLaunch(value)),
});

export default connect(
  select,
  perform
)(SettingAutoLaunch);
