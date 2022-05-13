import { connect } from 'react-redux';
import { doFetchInviteStatus } from 'redux/actions/user';
import { selectClaimForUri, selectTitleForUri } from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser, selectUserInviteStatusFetched } from 'redux/selectors/user';
import { selectContentPositionForUri } from 'redux/selectors/content';
import { selectActiveLivestreamForChannel } from 'redux/selectors/livestream';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);
  const { claim_id: claimId } = claim || {};

  return {
    claim,
    inviteStatusFetched: selectUserInviteStatusFetched(state),
    referralCode: selectUserInviteReferralCode(state),
    user: selectUser(state),
    title: selectTitleForUri(state, uri),
    position: selectContentPositionForUri(state, uri),
    hasActiveLivestream: Boolean(selectActiveLivestreamForChannel(state, claimId)),
  };
};

const perform = {
  doFetchInviteStatus,
};

export default connect(select, perform)(SocialShare);
