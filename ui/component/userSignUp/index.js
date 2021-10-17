import REWARD_TYPES from 'rewards';
import { connect } from 'react-redux';
import { selectGetSyncIsPending, selectSyncHash, selectPrefsReady } from 'redux/selectors/sync';
import { doClaimRewardType } from 'redux/actions/rewards';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClaimedRewards, makeSelectIsRewardClaimPending } from 'redux/selectors/rewards';
import { doUserFetch } from 'redux/actions/user';
import {
  selectUserIsPending,
  selectYoutubeChannels,
  selectEmailToVerify,
  selectUser,
  selectAccessToken,
} from 'redux/selectors/user';
import { selectMyChannelClaims, selectFetchingMyChannels, selectCreatingChannel } from 'redux/selectors/claims';
import { selectBalance } from 'redux/selectors/wallet';
import * as SETTINGS from 'constants/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectInterestedInYoutubeSync } from 'redux/selectors/app';
import { doToggleInterestedInYoutubeSync } from 'redux/actions/app';
import UserSignIn from './view';

const select = (state) => ({
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
  hasSynced: Boolean(selectSyncHash(state)),
  creatingChannel: selectCreatingChannel(state),
  interestedInYoutubeSync: selectInterestedInYoutubeSync(state),
  prefsReady: selectPrefsReady(state),
});

const perform = (dispatch) => ({
  fetchUser: () => dispatch(doUserFetch()),
  claimConfirmEmailReward: () =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.TYPE_CONFIRM_EMAIL, {
        notifyError: false,
      })
    ),
  claimNewUserReward: () =>
    dispatch(
      doClaimRewardType(REWARD_TYPES.NEW_USER, {
        notifyError: false,
      })
    ),
  setClientSetting: (setting, value, pushToPrefs) => dispatch(doSetClientSetting(setting, value, pushToPrefs)),
  doToggleInterestedInYoutubeSync: () => dispatch(doToggleInterestedInYoutubeSync()),
});

export default connect(select, perform)(UserSignIn);
