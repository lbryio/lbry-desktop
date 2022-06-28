import { connect } from 'react-redux';
import Wallpaper from './view';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';

const select = (state) => ({
  background: makeSelectClientSetting(SETTINGS.BACKGROUND)(state),
});

const perform = {};

export default connect(select, perform)(Wallpaper);
