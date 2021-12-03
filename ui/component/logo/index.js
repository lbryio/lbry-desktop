import { connect } from 'react-redux';
import Logo from './view';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => ({
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
});

export default connect(select)(Logo);
