import REWARD_TYPES from 'rewards';
import { connect } from 'react-redux';
import { selectGetSyncIsPending, selectGetSyncErrorMessage, selectSyncHash } from 'lbryinc';
import { doClaimRewardType } from 'redux/actions/rewards';
import { doSyncClientSettings, doSetClientSetting } from 'redux/actions/settings';
import { selectClaimedRewards, makeSelectIsRewardClaimPending } from 'redux/selectors/rewards';
import { doUserFetch } from 'redux/actions/user';
import {
  selectUserIsPending,
  selectYoutubeChannels,
  selectEmailToVerify,
  selectUser,
  selectAccessToken,
} from 'redux/selectors/user';
import {
  selectMyChannelClaims,
  selectBalance,
  selectFetchingMyChannels,
  selectCreatingChannel,
  SETTINGS,
} from 'lbry-redux';
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
  followingAcknowledged: makeSelectClientSetting(SETTINGS.FOLLOWING_ACKNOWLEDGED)(state),
  tagsAcknowledged: makeSelectClientSetting(SETTINGS.TAGS_ACKNOWLEDGED)(state),
  rewardsAcknowledged: makeSelectClientSetting(SETTINGS.REWARDS_ACKNOWLEDGED)(state),
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
  syncSettings: () => dispatch(doSyncClientSettings()),
  setClientSetting: (setting, value) => dispatch(doSetClientSetting(setting, value)),
});

export default connect(select, perform)(UserSignIn);
