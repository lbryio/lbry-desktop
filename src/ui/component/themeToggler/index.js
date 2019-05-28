import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import ThemeToggler from './view';

const select = state => ({
  currentTheme: makeSelectClientSetting(settings.THEME)(state),
  automaticDarkModeEnabled: makeSelectClientSetting(settings.AUTOMATIC_DARK_MODE_ENABLED)(state),
});

const perform = dispatch => ({
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
});

export default connect(
  select,
  perform
)(ThemeToggler);
