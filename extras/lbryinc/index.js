import * as LBRYINC_ACTIONS from 'constants/action_types';
import * as YOUTUBE_STATUSES from 'constants/youtube';
import * as ERRORS from 'constants/errors';
import Lbryio from './lbryio';

export { Lbryio };

// constants
export { LBRYINC_ACTIONS, YOUTUBE_STATUSES, ERRORS };

// utils
export { doTransifexUpload } from 'util/transifex-upload';

// actions
export { doGenerateAuthToken } from './redux/actions/auth';
export { doFetchCostInfoForUri } from './redux/actions/cost_info';
export { doBlackListedOutpointsSubscribe } from './redux/actions/blacklist';
export { doFilteredOutpointsSubscribe } from './redux/actions/filtered';
// export { doFetchFeaturedUris, doFetchTrendingUris } from './redux/actions/homepage';
export { doFetchViewCount, doFetchSubCount } from './redux/actions/stats';
export {
  doCheckSync,
  doGetSync,
  doSetSync,
  doSetDefaultAccount,
  doSyncApply,
  doResetSync,
  doSyncEncryptAndDecrypt,
} from 'redux/actions/sync';

// reducers
export { authReducer } from './redux/reducers/auth';
export { costInfoReducer } from './redux/reducers/cost_info';
export { blacklistReducer } from './redux/reducers/blacklist';
export { filteredReducer } from './redux/reducers/filtered';
// export { homepageReducer } from './redux/reducers/homepage';
export { statsReducer } from './redux/reducers/stats';
export { syncReducer } from './redux/reducers/sync';

// selectors
export { selectAuthToken, selectIsAuthenticating } from './redux/selectors/auth';
export {
  selectFetchingCostInfoForUri,
  selectCostInfoForUri,
  selectAllCostInfoByUri,
  selectFetchingCostInfo,
} from './redux/selectors/cost_info';
export { selectBlackListedOutpoints, selectBlacklistedOutpointMap } from './redux/selectors/blacklist';
export { selectFilteredOutpoints, selectFilteredOutpointMap } from './redux/selectors/filtered';
// export {
//   selectFeaturedUris,
//   selectFetchingFeaturedUris,
//   selectTrendingUris,
//   selectFetchingTrendingUris,
// } from './redux/selectors/homepage';
export { selectViewCount, selectViewCountForUri, selectSubCountForUri } from './redux/selectors/stats';
export { selectBanStateForUri } from './redux/selectors/ban';
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
} from './redux/selectors/sync';
