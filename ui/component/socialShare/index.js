import { connect } from 'react-redux';
import { doFetchInviteStatus } from 'redux/actions/user';
import { makeSelectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser, selectUserInviteStatusFetched } from 'redux/selectors/user';
import { selectContentPositionForUri } from 'redux/selectors/content';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  inviteStatusFetched: selectUserInviteStatusFetched(state),
  referralCode: selectUserInviteReferralCode(state),
  user: selectUser(state),
  title: selectTitleForUri(state, props.uri),
  position: selectContentPositionForUri(state, props.uri),
});

const perform = {
  doFetchInviteStatus,
};

export default connect(select, perform)(SocialShare);
