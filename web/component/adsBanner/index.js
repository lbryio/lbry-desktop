import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectShouldShowAds } from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import AdsBanner from './view';

const select = (state, props) => ({
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
  shouldShowAds: selectShouldShowAds(state),
});

export default connect(select)(AdsBanner);
