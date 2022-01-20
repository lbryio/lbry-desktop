import REWARD_TYPES from 'rewards';
import { connect } from 'react-redux';
import { selectGetSyncIsPending, selectSyncHash, selectPrefsReady } from 'redux/selectors/sync';
import { doClaimRewardType } from 'redux/actions/rewards';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectClaimedRewards, makeSelectIsRewardClaimPending } from 'redux/selectors/rewards';
import { selectUserIsPending, selectYoutubeChannels, selectEmailToVerify, selectUser } from 'redux/selectors/user';
import { selectMyChannelClaims, selectFetchingMyChannels, selectCreatingChannel } from 'redux/selectors/claims';
import { selectBalance } from 'redux/selectors/wallet';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectInterestedInYoutubeSync } from 'redux/selectors/app';
import { doToggleInterestedInYoutubeSync } from 'redux/actions/app';
import UserSignIn from './view';

const select = (state) => ({
  emailToVerify: selectEmailToVerify(state),
  user: selectUser(state),
  channels: selectMyChannelClaims(state),
  claimedRewards: selectClaimedRewards(state),
  claimingReward: makeSelectIsRewardClaimPending()(state, {
    reward_type: REWARD_TYPES.TYPE_CONFIRM_EMAIL,
  }),
  balance: selectBalance(state),
  fetchingChannels: selectFetchingMyChannels(state),
  youtubeChannels: selectYoutubeChannels(state),
  userFetchPending: selectUserIsPending(state),
  syncEnabled: selectClientSetting(state, SETTINGS.ENABLE_SYNC),
  followingAcknowledged: selectClientSetting(state, SETTINGS.FOLLOWING_ACKNOWLEDGED),
  tagsAcknowledged: selectClientSetting(state, SETTINGS.TAGS_ACKNOWLEDGED),
  rewardsAcknowledged: selectClientSetting(state, SETTINGS.REWARDS_ACKNOWLEDGED),
  syncingWallet: selectGetSyncIsPending(state),
  hasSynced: Boolean(selectSyncHash(state)),
  creatingChannel: selectCreatingChannel(state),
  interestedInYoutubeSync: selectInterestedInYoutubeSync(state),
  prefsReady: selectPrefsReady(state),
});

const perform = (dispatch) => ({
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
