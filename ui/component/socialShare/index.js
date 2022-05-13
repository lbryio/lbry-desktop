import { connect } from 'react-redux';
import { doFetchInviteStatus } from 'redux/actions/user';
import { selectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser, selectUserInviteStatusFetched } from 'redux/selectors/user';
import { selectContentPositionForUri } from 'redux/selectors/content';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    inviteStatusFetched: selectUserInviteStatusFetched(state),
    referralCode: selectUserInviteReferralCode(state),
    user: selectUser(state),
    title: selectTitleForUri(state, uri),
    position: selectContentPositionForUri(state, uri),
  };
};

const perform = {
  doFetchInviteStatus,
};

export default connect(select, perform)(SocialShare);
