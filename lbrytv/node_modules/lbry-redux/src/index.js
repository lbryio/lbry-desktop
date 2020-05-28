import * as CLAIM_VALUES from 'constants/claim';
import * as ACTIONS from 'constants/action_types';
import * as LICENSES from 'constants/licenses';
import * as PAGES from 'constants/pages';
import * as SETTINGS from 'constants/settings';
import * as SORT_OPTIONS from 'constants/sort_options';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import * as TRANSACTIONS from 'constants/transaction_types';
import * as TX_LIST from 'constants/transaction_list';
import * as ABANDON_STATES from 'constants/abandon_states';
import * as TXO_LIST from 'constants/txo_list';
import * as SPEECH_URLS from 'constants/speech_urls';
import * as DAEMON_SETTINGS from 'constants/daemon_settings';
import * as SHARED_PREFERENCES from 'constants/shared_preferences';
import { SEARCH_TYPES, SEARCH_OPTIONS } from 'constants/search';
import { DEFAULT_KNOWN_TAGS, DEFAULT_FOLLOWED_TAGS, MATURE_TAGS } from 'constants/tags';
import Lbry, { apiCall } from 'lbry';
import { selectState as selectSearchState } from 'redux/selectors/search';

// constants
export {
  ACTIONS,
  CLAIM_VALUES,
  LICENSES,
  THUMBNAIL_STATUSES,
  SEARCH_TYPES,
  SEARCH_OPTIONS,
  SETTINGS,
  DAEMON_SETTINGS,
  TRANSACTIONS,
  TX_LIST,
  TXO_LIST,
  ABANDON_STATES,
  SORT_OPTIONS,
  PAGES,
  DEFAULT_KNOWN_TAGS,
  DEFAULT_FOLLOWED_TAGS,
  MATURE_TAGS,
  SPEECH_URLS,
  SHARED_PREFERENCES,
};

// common
export { Lbry, apiCall };
export {
  regexInvalidURI,
  regexAddress,
  parseURI,
  buildURI,
  normalizeURI,
  isURIValid,
  isURIClaimable,
  isNameValid,
  convertToShareLink,
} from 'lbryURI';

// middlware
export { buildSharedStateMiddleware } from 'redux/middleware/shared-state';

// actions
export { doToast, doDismissToast, doError, doDismissError } from 'redux/actions/notifications';

export {
  doFetchClaimsByChannel,
  doFetchClaimListMine,
  doAbandonClaim,
  doAbandonTxo,
  doResolveUris,
  doResolveUri,
  doFetchChannelListMine,
  doCreateChannel,
  doUpdateChannel,
  doClaimSearch,
  doImportChannel,
  doRepost,
  doClearRepostError,
  doCheckPublishNameAvailability,
  doPurchaseList,
} from 'redux/actions/claims';

export { doClearPurchasedUriSuccess, doPurchaseUri, doFileGet } from 'redux/actions/file';

export {
  doFetchFileInfo,
  doFileList,
  doFetchFileInfos,
  doSetFileListSort,
} from 'redux/actions/file_info';

export {
  doResetThumbnailStatus,
  doClearPublish,
  doUpdatePublishForm,
  doUploadThumbnail,
  doPrepareEdit,
  doPublish,
  doCheckPendingPublishes,
  doCheckReflectingFiles,
} from 'redux/actions/publish';

export {
  doSearch,
  doResolvedSearch,
  doUpdateSearchQuery,
  doFocusSearchInput,
  doBlurSearchInput,
  setSearchApi,
  doUpdateSearchOptions,
} from 'redux/actions/search';

export { savePosition } from 'redux/actions/content';

export {
  doUpdateBalance,
  doBalanceSubscribe,
  doFetchTransactions,
  doFetchTxoPage,
  doUpdateTxoPageParams,
  doGetNewAddress,
  doCheckAddressIsMine,
  doSendDraftTransaction,
  doSetDraftTransactionAmount,
  doSetDraftTransactionAddress,
  doSendTip,
  doWalletEncrypt,
  doWalletDecrypt,
  doWalletUnlock,
  doWalletStatus,
  doWalletReconnect,
  doSetTransactionListFilter,
  doUpdateBlockHeight,
  doClearSupport,
  doSupportAbandonForClaim,
} from 'redux/actions/wallet';

export { doToggleTagFollow, doAddTag, doDeleteTag } from 'redux/actions/tags';

export {
  doCommentList,
  doCommentCreate,
  doCommentAbandon,
  doCommentHide,
  doCommentUpdate,
} from 'redux/actions/comments';

export { doToggleBlockChannel } from 'redux/actions/blocked';

export { doPopulateSharedUserState, doPreferenceGet, doPreferenceSet } from 'redux/actions/sync';

// utils
export { batchActions } from 'util/batch-actions';
export { parseQueryParams, toQueryString } from 'util/query-params';
export { formatCredits, formatFullPrice, creditsToString } from 'util/format-credits';
export { isClaimNsfw, createNormalizedClaimSearchKey } from 'util/claim';

// reducers
export { claimsReducer } from 'redux/reducers/claims';
export { commentReducer } from 'redux/reducers/comments';
export { contentReducer } from 'redux/reducers/content';
export { fileInfoReducer } from 'redux/reducers/file_info';
export { notificationsReducer } from 'redux/reducers/notifications';
export { publishReducer } from 'redux/reducers/publish';
export { searchReducer } from 'redux/reducers/search';
export { tagsReducer } from 'redux/reducers/tags';
export { blockedReducer } from 'redux/reducers/blocked';
export { walletReducer } from 'redux/reducers/wallet';

// selectors
export { makeSelectContentPositionForUri } from 'redux/selectors/content';

export { selectToast, selectError } from 'redux/selectors/notifications';

export {
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  makeSelectFetchingChannelClaims,
  makeSelectClaimsInChannelForPage,
  makeSelectTotalPagesInChannelSearch,
  makeSelectTotalClaimsInChannelSearch,
  makeSelectMetadataForUri,
  makeSelectMetadataItemForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  makeSelectTitleForUri,
  makeSelectDateForUri,
  makeSelectAmountForUri,
  makeSelectTagsForUri,
  makeSelectContentTypeForUri,
  makeSelectIsUriResolving,
  makeSelectTotalItemsForChannel,
  makeSelectTotalPagesForChannel,
  makeSelectNsfwCountFromUris,
  makeSelectNsfwCountForChannel,
  makeSelectOmittedCountForChannel,
  makeSelectClaimIsNsfw,
  makeSelectRecommendedContentForUri,
  makeSelectResolvedRecommendedContentForUri,
  makeSelectFirstRecommendedFileForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsPending,
  makeSelectPendingByUri,
  makeSelectReflectingClaimForUri,
  makeSelectClaimsInChannelForCurrentPageState,
  makeSelectShortUrlForUri,
  makeSelectCanonicalUrlForUri,
  makeSelectPermanentUrlForUri,
  makeSelectSupportsForUri,
  makeSelectMyPurchasesForPage,
  makeSelectClaimWasPurchased,
  selectPendingById,
  selectReflectingById,
  selectClaimsById,
  selectClaimsByUri,
  selectAllClaimsByChannel,
  selectMyClaimsRaw,
  selectAbandoningIds,
  selectMyActiveClaims,
  selectAllFetchingChannelClaims,
  selectIsFetchingClaimListMine,
  selectPendingClaims,
  selectMyClaims,
  selectMyClaimsWithoutChannels,
  selectMyClaimUrisWithoutChannels,
  selectAllMyClaimsByOutpoint,
  selectMyClaimsOutpoints,
  selectFetchingMyChannels,
  selectMyChannelClaims,
  selectResolvingUris,
  selectPlayingUri,
  selectChannelClaimCounts,
  selectCurrentChannelPage,
  selectFetchingClaimSearch,
  selectFetchingClaimSearchByQuery,
  selectClaimSearchByQuery,
  selectClaimSearchByQueryLastPageReached,
  selectUpdatingChannel,
  selectUpdateChannelError,
  selectCreatingChannel,
  selectCreateChannelError,
  selectChannelImportPending,
  makeSelectMyStreamUrlsForPage,
  selectMyStreamUrlsCount,
  selectRepostError,
  selectRepostLoading,
  selectClaimIdsByUri,
  selectMyClaimsPage,
  selectMyClaimsPageNumber,
  selectMyClaimsPageItemCount,
  selectFetchingMyClaimsPageError,
  selectMyPurchases,
  selectIsFetchingMyPurchases,
  selectFetchingMyPurchasesError,
  selectMyPurchasesCount,
  selectPurchaseUriSuccess,
} from 'redux/selectors/claims';

export { makeSelectCommentsForUri } from 'redux/selectors/comments';

export {
  makeSelectFileInfoForUri,
  makeSelectDownloadingForUri,
  makeSelectLoadingForUri,
  selectFileInfosByOutpoint,
  selectIsFetchingFileList,
  selectIsFetchingFileListDownloadedOrPublished,
  selectDownloadingByOutpoint,
  selectUrisLoading,
  selectFileInfosDownloaded,
  selectDownloadingFileInfos,
  selectTotalDownloadProgress,
  selectFileListDownloadedSort,
  selectFileListPublishedSort,
  selectDownloadedUris,
  makeSelectMediaTypeForUri,
  makeSelectUriIsStreamable,
  makeSelectDownloadPathForUri,
  makeSelectFileNameForUri,
  makeSelectFilePartlyDownloaded,
  makeSelectSearchDownloadUrlsForPage,
  makeSelectSearchDownloadUrlsCount,
  selectDownloadUrlsCount,
  makeSelectStreamingUrlForUri,
} from 'redux/selectors/file_info';

export {
  makeSelectPublishFormValue,
  selectPublishFormValues,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
} from 'redux/selectors/publish';

export { selectSearchState };
export {
  makeSelectSearchUris,
  makeSelectResolvedSearchResults,
  makeSelectResolvedSearchResultsLastPageReached,
  selectSearchValue,
  selectSearchOptions,
  selectIsSearching,
  selectResolvedSearchResultsByQuery,
  selectResolvedSearchResultsByQueryLastPageReached,
  selectSearchUrisByQuery,
  selectSearchBarFocused,
  selectSearchSuggestions,
  makeSelectQueryWithOptions,
} from 'redux/selectors/search';

export {
  selectBalance,
  selectTotalBalance,
  selectReservedBalance,
  selectClaimsBalance,
  selectSupportsBalance,
  selectTipsBalance,
  selectTransactionsById,
  selectSupportsByOutpoint,
  selectTotalSupports,
  selectTransactionItems,
  selectRecentTransactions,
  selectHasTransactions,
  selectIsFetchingTransactions,
  selectIsSendingSupport,
  selectReceiveAddress,
  selectGettingNewAddress,
  selectDraftTransaction,
  selectDraftTransactionAmount,
  selectDraftTransactionAddress,
  selectDraftTransactionError,
  selectBlocks,
  selectWalletIsEncrypted,
  selectWalletState,
  selectWalletEncryptPending,
  selectWalletEncryptSucceeded,
  selectWalletEncryptResult,
  selectWalletDecryptPending,
  selectWalletDecryptSucceeded,
  selectWalletDecryptResult,
  selectWalletUnlockPending,
  selectWalletUnlockSucceeded,
  selectWalletUnlockResult,
  selectTransactionListFilter,
  selectFilteredTransactions,
  selectTxoPageParams,
  selectTxoPage,
  selectTxoPageNumber,
  selectTxoItemCount,
  selectIsFetchingTxos,
  selectFetchingTxosError,
  makeSelectLatestTransactions,
  makeSelectFilteredTransactionsForPage,
  selectFilteredTransactionCount,
  selectIsWalletReconnecting,
  selectPendingSupportTransactions,
  selectAbandonClaimSupportError,
  makeSelectPendingAmountByUri,
} from 'redux/selectors/wallet';

export {
  selectFollowedTags,
  selectFollowedTagsList,
  selectUnfollowedTags,
  makeSelectIsFollowingTag,
} from 'redux/selectors/tags';

export {
  selectBlockedChannels,
  selectChannelIsBlocked,
  selectBlockedChannelsCount,
} from 'redux/selectors/blocked';
