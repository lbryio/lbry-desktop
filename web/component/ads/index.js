import { connect } from 'react-redux';
import { doSetAdBlockerFound } from 'redux/actions/app';
import { selectTheme } from 'redux/selectors/settings';
import { makeSelectClaimForUri, selectClaimIsNsfwForUri } from 'redux/selectors/claims';
import { selectOdyseeMembershipIsPremiumPlus } from 'redux/selectors/user';
import Ads from './view';

const select = (state, props) => ({
  theme: selectTheme(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  isMature: selectClaimIsNsfwForUri(state, props.uri),
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
});

const perform = {
  doSetAdBlockerFound,
};

export default connect(select, perform)(Ads);
