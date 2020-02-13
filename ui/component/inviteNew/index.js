import { connect } from 'react-redux';
import {
  selectUserInvitesRemaining,
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
  selectUserInviteReferralLink,
  selectUserInviteReferralCode,
  doUserInviteNew,
} from 'lbryinc';
import {
  selectMyChannelClaims,
  selectFetchingMyChannels,
  doFetchChannelListMine,
  doResolveUris,
  selectResolvingUris,
} from 'lbry-redux';
import InviteNew from './view';

const select = state => ({
  errorMessage: selectUserInviteNewErrorMessage(state),
  invitesRemaining: selectUserInvitesRemaining(state),
  referralLink: selectUserInviteReferralLink(state),
  referralCode: selectUserInviteReferralCode(state),
  isPending: selectUserInviteNewIsPending(state),
  channels: selectMyChannelClaims(state),
  fetchingChannels: selectFetchingMyChannels(state),
  resolvingUris: selectResolvingUris(state),
});

const perform = dispatch => ({
  inviteNew: email => dispatch(doUserInviteNew(email)),
  fetchChannelListMine: () => dispatch(doFetchChannelListMine()),
  resolveUris: uris => dispatch(doResolveUris(uris)),
});

export default connect(
  select,
  perform
)(InviteNew);
