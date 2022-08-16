import { connect } from 'react-redux';
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

export default connect(select)(Ads);
