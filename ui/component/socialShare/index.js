import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser } from 'redux/selectors/user';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  referralCode: selectUserInviteReferralCode(state),
  user: selectUser(state),
  title: selectTitleForUri(state, props.uri),
  position: makeSelectContentPositionForUri(props.uri)(state),
});

export default connect(select)(SocialShare);
