import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import {
  selectEmailToVerify,
  selectUser,
  selectAccessToken,
  makeSelectIsRewardClaimPending,
  selectClaimedRewards,
  rewards as REWARD_TYPES,
  doClaimRewardType,
  doUserFetch,
  selectUserIsPending,
  selectYoutubeChannels,
  selectGetSyncIsPending,
  selectGetSyncErrorMessage,
  selectSyncHash,
} from 'lbryinc';
import { selectMyChannelClaims, selectBalance, selectFetchingMyChannels, selectCreatingChannel } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import UserSignIn from './view';

const select = state => ({
  emailToVerify: selectEmailToVerify(state),
  user: selectUser(state),
  accessToken: selectAccessToken(state),
  channels: selectMyChannelClaims(state),
  claimedRewards: selectClaimedRewards(state),
  claimingReward: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARD_TYPES.TYPE_CONFIRM_EMAIL,
  }),
  balance: selectBalance(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
  userFetchPending: selectUserIsPending(state),
  syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
  syncingWallet: selectGetSyncIsPending(state),
  getSyncError: selectGetSyncErrorMessage(state),
  hasSynced: Boolean(selectSyncHash(state)),
  creatingChannel: selectCreatingChannel(state),
});

const perform = dispatch => ({
  fetchUser: () => dispatch(doUserFetch()),
  claimReward: () =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.TYPE_CONFIRM_EMAIL, {
        notifyError: false,
      })
    ),
});

export default connect(
  select,
  perform
)(UserSignIn);
