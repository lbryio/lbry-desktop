import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { doSetLanguage } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import SettingLanguage from './view';

const select = state => ({
  language: makeSelectClientSetting(SETTINGS.LANGUAGE)(state),
});

const perform = dispatch => ({
  setLanguage: value => dispatch(doSetLanguage(value)),
});

export default connect(select, perform)(SettingLanguage);
