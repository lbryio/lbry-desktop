import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser } from 'lbryinc';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  referralCode: selectUserInviteReferralCode(state),
  user: selectUser(state),
});

export default connect(select)(SocialShare);
