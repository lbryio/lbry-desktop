import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doToast } from 'lbry-redux';
import SettingLanguage from './view';

const select = state => ({
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  showToast: options => dispatch(doToast(options)),
});

export default connect(
  select,
  perform
)(SettingLanguage);
