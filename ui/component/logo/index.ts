//@ts-nocheck
import {connect} from 'react-redux';
import Logo from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state: unknown, props: unknown) => ({
  currentTheme: makeSelectClientSetting(SETTINGS.THEME)(state),
});

export default connect(select)(Logo);
