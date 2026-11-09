//@ts-nocheck
import {connect} from 'react-redux';
import Wallpaper from './view';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state: unknown) => ({
  disableBackground: makeSelectClientSetting(SETTINGS.DISABLE_BACKGROUND)(state),
});

const perform: Record<string, any> = {};

export default connect(select, perform)(Wallpaper);
