import { connect } from 'react-redux';
import { doSetAdBlockerFound } from 'redux/actions/app';
import { selectAdBlockerFound } from 'redux/selectors/app';
import { selectHomepageData } from 'redux/selectors/settings';
import { selectOdyseeMembershipIsPremiumPlus, selectUserCountry } from 'redux/selectors/user';
import AdsSticky from './view';

const select = (state, props) => ({
  isAdBlockerFound: selectAdBlockerFound(state),
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  userCountry: selectUserCountry(state),
  homepageData: selectHomepageData(state),
});

const perform = {
  doSetAdBlockerFound,
};

export default connect(select, perform)(AdsSticky);
