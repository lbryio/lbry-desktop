import * as LBRYINC_ACTIONS from 'constants/action_types';
import * as YOUTUBE_STATUSES from 'constants/youtube';
import * as ERRORS from 'constants/errors';
import Lbryio from 'lbryio';
import rewards from 'rewards';
import subscriptionsReducer from 'redux/reducers/subscriptions';

// middleware
export { userStateSyncMiddleware } from 'redux/middleware/sync';

// constants
export { LBRYINC_ACTIONS, YOUTUBE_STATUSES, ERRORS };

// Lbryio and rewards
export { Lbryio, rewards };

// utils
export { doTransifexUpload } from 'util/transifex-upload';

// actions
export { doGenerateAuthToken } from 'redux/actions/auth';
export {
  doRewardList,
  doClaimRewardType,
  doClaimEligiblePurchaseRewards,
  doClaimRewardClearError,
  doFetchRewardedContent,
} from 'redux/actions/rewards';
export {
  doChannelSubscribe,
  doChannelUnsubscribe,
  doChannelSubscriptionEnableNotifications,
  doChannelSubscriptionDisableNotifications,
  doCheckSubscription,
  doCheckSubscriptions,
  doCheckSubscriptionsInit,
  doCompleteFirstRun,
  doFetchMySubscriptions,
  doFetchRecommendedSubscriptions,
  doRemoveUnreadSubscription,
  doRemoveUnreadSubscriptions,
  doSetViewMode,
  doShowSuggestedSubs,
  doUpdateUnreadSubscriptions,
  setSubscriptionLatest,
} from 'redux/actions/subscriptions';
export {
  doFetchInviteStatus,
  doInstallNew,
  doInstallNewWithParams,
  doAuthenticate,
  doUserFetch,
  doUserSignIn,
  doUserSignUp,
  doUserEmailNew,
  doUserCheckEmailVerified,
  doUserEmailToVerify,
  doUserEmailVerifyFailure,
  doUserEmailVerify,
  doUserPhoneNew,
  doUserPhoneReset,
  doUserPhoneVerifyFailure,
  doUserPhoneVerify,
  doFetchAccessToken,
  doUserResendVerificationEmail,
  doUserIdentityVerify,
  doUserInviteNew,
  doClaimYoutubeChannels,
  doCheckYoutubeTransfer,
  doUserSetReferrer,
  doUserSetReferrerReset,
  doUserPasswordReset,
  doUserPasswordSet,
  doUserCheckIfEmailExists,
  doClearEmailEntry,
  doClearPasswordEntry,
} from 'redux/actions/user';
export { doFetchCostInfoForUri } from 'redux/actions/cost_info';
export { doBlackListedOutpointsSubscribe } from 'redux/actions/blacklist';
export { doFilteredOutpointsSubscribe } from 'redux/actions/filtered';
export { doFetchFeaturedUris, doFetchTrendingUris } from 'redux/actions/homepage';
export { doFetchViewCount, doFetchSubCount } from 'redux/actions/stats';
export {
  doCheckSync,
  doGetSync,
  doSetSync,
  doSetDefaultAccount,
  doSyncApply,
  doResetSync,
  doSyncEncryptAndDecrypt,
} from 'redux/actions/sync';
export { doUpdateUploadProgress } from 'redux/actions/lbrytv';

// reducers
export { authReducer } from 'redux/reducers/auth';
export { rewardsReducer } from 'redux/reducers/rewards';
export { subscriptionsReducer };
export { userReducer } from 'redux/reducers/user';
export { costInfoReducer } from 'redux/reducers/cost_info';
export { blacklistReducer } from 'redux/reducers/blacklist';
export { filteredReducer } from 'redux/reducers/filtered';
export { homepageReducer } from 'redux/reducers/homepage';
export { statsReducer } from 'redux/reducers/stats';
export { syncReducer } from 'redux/reducers/sync';
export { lbrytvReducer } from 'redux/reducers/lbrytv';

// selectors
export { selectAuthToken, selectIsAuthenticating } from 'redux/selectors/auth';
export {
  makeSelectClaimRewardError,
  makeSelectIsRewardClaimPending,
  makeSelectRewardAmountByType,
  makeSelectRewardByType,
  makeSelectRewardByClaimCode,
  selectUnclaimedRewardsByType,
  selectClaimedRewardsById,
  selectClaimedRewards,
  selectClaimedRewardsByTransactionId,
  selectUnclaimedRewards,
  selectFetchingRewards,
  selectUnclaimedRewardValue,
  selectClaimsPendingByType,
  selectClaimErrorsByType,
  selectRewardContentClaimIds,
  selectReferralReward,
} from 'redux/selectors/rewards';
export {
  makeSelectIsNew,
  makeSelectIsSubscribed,
  makeSelectUnreadByChannel,
  selectEnabledChannelNotifications,
  selectSubscriptions,
  selectIsFetchingSubscriptions,
  selectViewMode,
  selectSuggested,
  selectIsFetchingSuggested,
  selectSuggestedChannels,
  selectFirstRunCompleted,
  selectShowSuggestedSubs,
  selectSubscriptionsBeingFetched,
  selectUnreadByChannel,
  selectUnreadAmount,
  selectUnreadSubscriptions,
  selectSubscriptionClaims,
} from 'redux/selectors/subscriptions';
export {
  selectAuthenticationIsPending,
  selectUserIsPending,
  selectUser,
  selectUserEmail,
  selectUserPhone,
  selectUserCountryCode,
  selectEmailToVerify,
  selectPhoneToVerify,
  selectUserIsRewardApproved,
  selectEmailNewIsPending,
  selectEmailNewErrorMessage,
  selectPhoneNewErrorMessage,
  selectPhoneNewIsPending,
  selectEmailVerifyIsPending,
  selectEmailVerifyErrorMessage,
  selectEmailAlreadyExists,
  selectEmailDoesNotExist,
  selectResendingVerificationEmail,
  selectPhoneVerifyErrorMessage,
  selectPhoneVerifyIsPending,
  selectIdentityVerifyIsPending,
  selectIdentityVerifyErrorMessage,
  selectUserIsVerificationCandidate,
  selectAccessToken,
  selectUserInviteStatusIsPending,
  selectUserInvitesRemaining,
  selectUserInvitees,
  selectUserInviteStatusFailed,
  selectUserInviteNewIsPending,
  selectUserInviteNewErrorMessage,
  selectUserInviteReferralLink,
  selectUserInviteReferralCode,
  selectUserVerifiedEmail,
  selectYoutubeChannels,
  selectYouTubeImportPending,
  selectYouTubeImportError,
  selectYouTubeImportVideosComplete,
  selectSetReferrerPending,
  selectSetReferrerError,
  selectPasswordResetIsPending,
  selectPasswordResetSuccess,
  selectPasswordResetError,
  selectPasswordSetIsPending,
  selectPasswordSetSuccess,
  selectPasswordSetError,
  selectPasswordExists,
} from 'redux/selectors/user';
export {
  makeSelectFetchingCostInfoForUri,
  makeSelectCostInfoForUri,
  selectAllCostInfoByUri,
  selectFetchingCostInfo,
} from 'redux/selectors/cost_info';
export { selectBlackListedOutpoints } from 'redux/selectors/blacklist';
export { selectFilteredOutpoints } from 'redux/selectors/filtered';
export {
  selectFeaturedUris,
  selectFetchingFeaturedUris,
  selectTrendingUris,
  selectFetchingTrendingUris,
} from 'redux/selectors/homepage';
export { makeSelectViewCountForUri, makeSelectSubCountForUri } from 'redux/selectors/stats';
export {
  selectHasSyncedWallet,
  selectSyncData,
  selectSyncHash,
  selectSetSyncErrorMessage,
  selectGetSyncErrorMessage,
  selectGetSyncIsPending,
  selectSetSyncIsPending,
  selectSyncApplyIsPending,
  selectHashChanged,
  selectSyncApplyErrorMessage,
  selectSyncApplyPasswordError,
} from 'redux/selectors/sync';
export { selectCurrentUploads, selectUploadCount } from 'redux/selectors/lbrytv';
