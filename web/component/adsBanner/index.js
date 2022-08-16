import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectAdBlockerFound } from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectOdyseeMembershipIsPremiumPlus, selectUserCountry } from 'redux/selectors/user';
import AdsBanner from './view';

const select = (state, props) => ({
  isAdBlockerFound: selectAdBlockerFound(state),
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  userCountry: selectUserCountry(state),
  currentTheme: selectClientSetting(state, SETTINGS.THEME),
});

export default connect(select)(AdsBanner);
