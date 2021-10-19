import { connect } from 'react-redux';
import Logo from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => ({
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
});

export default connect(select)(Logo);
