import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTitleForUri } from 'lbry-redux';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser } from 'lbryinc';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  referralCode: selectUserInviteReferralCode(state),
  user: selectUser(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

export default connect(select)(SocialShare);
