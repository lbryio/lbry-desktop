import { connect } from 'react-redux';
import { doSetAdBlockerFound } from 'redux/actions/app';
import { selectAdBlockerFound } from 'redux/selectors/app';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import { selectOdyseeMembershipIsPremiumPlus, selectUserCountry } from 'redux/selectors/user';
import Ads from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
  isAdBlockerFound: selectAdBlockerFound(state),
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
  userCountry: selectUserCountry(state),
});

const perform = {
  doSetAdBlockerFound,
};

export default connect(select, perform)(Ads);
