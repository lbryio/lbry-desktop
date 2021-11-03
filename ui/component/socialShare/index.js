import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectTitleForUri } from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser } from 'redux/selectors/user';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  referralCode: selectUserInviteReferralCode(state),
  user: selectUser(state),
  title: makeSelectTitleForUri(props.uri)(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
});

export default connect(select)(SocialShare);
