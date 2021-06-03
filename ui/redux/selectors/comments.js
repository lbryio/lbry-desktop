// @flow
import { createSelector } from 'reselect';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectBlacklistedOutpointMap, selectFilteredOutpointMap } from 'lbryinc';
import { selectClaimsById, isClaimNsfw, selectMyActiveClaims, makeSelectClaimForUri } from 'lbry-redux';

const selectState = (state) => state.comments || {};

export const selectCommentsById = createSelector(selectState, (state) => state.commentById || {});
export const selectIsFetchingComments = createSelector(selectState, (state) => state.isLoading);
export const selectIsPostingComment = createSelector(selectState, (state) => state.isCommenting);
export const selectIsFetchingReacts = createSelector(selectState, (state) => state.isFetchingReacts);
export const selectCommentsDisabledChannelIds = createSelector(
  selectState,
  (state) => state.commentsDisabledChannelIds
);
export const selectOthersReactsById = createSelector(selectState, (state) => state.othersReactsByCommentId);
export const selectModerationBlockList = createSelector(selectState, (state) =>
  state.moderationBlockList ? state.moderationBlockList.reverse() : []
);
export const selectBlockingByUri = createSelector(selectState, (state) => state.blockingByUri);
export const selectUnBlockingByUri = createSelector(selectState, (state) => state.unBlockingByUri);
export const selectFetchingModerationBlockList = createSelector(
  selectState,
  (state) => state.fetchingModerationBlockList
);

export const selectCommentsByClaimId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byClaimId = state.byId || {};
  const comments = {};

  // replace every comment_id in the list with the actual comment object
  Object.keys(byClaimId).forEach((claimId: string) => {
    const commentIds = byClaimId[claimId];

    comments[claimId] = Array(commentIds === null ? 0 : commentIds.length);
    for (let i = 0; i < commentIds.length; i++) {
      comments[claimId][i] = byId[commentIds[i]];
    }
  });

  return comments;
});

export const selectSuperchatsByUri = createSelector(selectState, (state) => state.superChatsByUri);

export const selectTopLevelCommentsByClaimId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byClaimId = state.topLevelCommentsById || {};
  const comments = {};

  // replace every comment_id in the list with the actual comment object
  Object.keys(byClaimId).forEach((claimId) => {
    const commentIds = byClaimId[claimId];

    comments[claimId] = Array(commentIds === null ? 0 : commentIds.length);
    for (let i = 0; i < commentIds.length; i++) {
      comments[claimId][i] = byId[commentIds[i]];
    }
  });

  return comments;
});

export const makeSelectCommentForCommentId = (commentId: string) =>
  createSelector(selectCommentsById, (comments) => comments[commentId]);

export const selectRepliesByParentId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byParentId = state.repliesByParentId || {};
  const comments = {};

  // replace every comment_id in the list with the actual comment object
  Object.keys(byParentId).forEach((id) => {
    const commentIds = byParentId[id];

    comments[id] = Array(commentIds === null ? 0 : commentIds.length);
    for (let i = 0; i < commentIds.length; i++) {
      comments[id][i] = byId[commentIds[i]];
    }
  });

  return comments;
});

// previously this used a mapping from claimId -> Array<Comments>
/* export const selectCommentsById = createSelector(
  selectState,
  state => state.byId || {}
); */
export const selectCommentsByUri = createSelector(selectState, (state) => {
  const byUri = state.commentsByUri || {};
  const comments = {};
  Object.keys(byUri).forEach((uri) => {
    const claimId = byUri[uri];
    if (claimId === null) {
      comments[uri] = null;
    } else {
      comments[uri] = claimId;
    }
  });

  return comments;
});

export const makeSelectCommentIdsForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, selectClaimsById, (state, byUri) => {
    const claimId = byUri[uri];
    return state.byId[claimId];
  });

export const makeSelectMyReactionsForComment = (commentId: string) =>
  createSelector(selectState, (state) => {
    if (!state.myReactsByCommentId) {
      return [];
    }

    return state.myReactsByCommentId[commentId] || [];
  });

export const makeSelectOthersReactionsForComment = (commentId: string) =>
  createSelector(selectState, (state) => {
    if (!state.othersReactsByCommentId) {
      return {};
    }

    return state.othersReactsByCommentId[commentId] || {};
  });

export const selectPendingCommentReacts = createSelector(selectState, (state) => state.pendingCommentReactions);

export const selectSettingsByChannelId = createSelector(selectState, (state) => state.settingsByChannelId);

export const selectFetchingCreatorSettings = createSelector(selectState, (state) => state.fetchingSettings);

export const selectFetchingBlockedWords = createSelector(selectState, (state) => state.fetchingBlockedWords);

export const makeSelectCommentsForUri = (uri: string) =>
  createSelector(
    selectCommentsByClaimId,
    selectCommentsByUri,
    selectClaimsById,
    selectMyActiveClaims,
    selectMutedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    selectShowMatureContent,
    (byClaimId, byUri, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];

      return comments
        ? comments.filter((comment) => {
            if (!comment) {
              // It may have been recently deleted after being blocked
              return false;
            }

            const channelClaim = claimsById[comment.channel_id];

            // Return comment if `channelClaim` doesn't exist so the component knows to resolve the author
            if (channelClaim) {
              if (myClaims && myClaims.size > 0) {
                const claimIsMine = channelClaim.is_my_output || myClaims.has(channelClaim.claim_id);
                if (claimIsMine) {
                  return true;
                }
              }

              const outpoint = `${channelClaim.txid}:${channelClaim.nout}`;
              if (blacklistedMap[outpoint] || filteredMap[outpoint]) {
                return false;
              }

              if (!showMatureContent) {
                const claimIsMature = isClaimNsfw(channelClaim);
                if (claimIsMature) {
                  return false;
                }
              }
            }

            return !blockedChannels.includes(comment.channel_url);
          })
        : [];
    }
  );

export const makeSelectTopLevelCommentsForUri = (uri: string) =>
  createSelector(
    selectTopLevelCommentsByClaimId,
    selectCommentsByUri,
    selectClaimsById,
    selectMyActiveClaims,
    selectMutedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    selectShowMatureContent,
    (byClaimId, byUri, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];

      return comments
        ? comments.filter((comment) => {
            if (!comment) {
              return false;
            }

            const channelClaim = claimsById[comment.channel_id];

            // Return comment if `channelClaim` doesn't exist so the component knows to resolve the author
            if (channelClaim) {
              if (myClaims && myClaims.size > 0) {
                const claimIsMine = channelClaim.is_my_output || myClaims.has(channelClaim.claim_id);
                if (claimIsMine) {
                  return true;
                }
              }

              const outpoint = `${channelClaim.txid}:${channelClaim.nout}`;
              if (blacklistedMap[outpoint] || filteredMap[outpoint]) {
                return false;
              }

              if (!showMatureContent) {
                const claimIsMature = isClaimNsfw(channelClaim);
                if (claimIsMature) {
                  return false;
                }
              }
            }

            return !blockedChannels.includes(comment.channel_url);
          })
        : [];
    }
  );

export const makeSelectRepliesForParentId = (id: string) =>
  createSelector(
    selectState, // no selectRepliesByParentId
    selectCommentsById,
    selectClaimsById,
    selectMyActiveClaims,
    selectMutedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    selectShowMatureContent,
    (state, commentsById, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      // const claimId = byUri[uri]; // just parentId (id)
      const replyIdsByParentId = state.repliesByParentId;
      const replyIdsForParent = replyIdsByParentId[id] || [];
      if (!replyIdsForParent.length) return null;

      const comments = [];
      replyIdsForParent.forEach((cid) => {
        comments.push(commentsById[cid]);
      });
      // const comments = byParentId && byParentId[id];

      return comments
        ? comments.filter((comment) => {
            if (!comment) {
              return false;
            }

            const channelClaim = claimsById[comment.channel_id];

            // Return comment if `channelClaim` doesn't exist so the component knows to resolve the author
            if (channelClaim) {
              if (myClaims && myClaims.size > 0) {
                const claimIsMine = channelClaim.is_my_output || myClaims.has(channelClaim.claim_id);
                if (claimIsMine) {
                  return true;
                }
              }

              const outpoint = `${channelClaim.txid}:${channelClaim.nout}`;
              if (blacklistedMap[outpoint] || filteredMap[outpoint]) {
                return false;
              }

              if (!showMatureContent) {
                const claimIsMature = isClaimNsfw(channelClaim);
                if (claimIsMature) {
                  return false;
                }
              }
            }

            return !blockedChannels.includes(comment.channel_url);
          })
        : [];
    }
  );

export const makeSelectTotalCommentsCountForUri = (uri: string) =>
  createSelector(makeSelectCommentsForUri(uri), (comments) => {
    return comments ? comments.length : 0;
  });

export const makeSelectChannelIsBlocked = (uri: string) =>
  createSelector(selectModerationBlockList, (blockedChannelUris) => {
    if (!blockedChannelUris || !blockedChannelUris) {
      return false;
    }

    return blockedChannelUris.includes(uri);
  });

export const makeSelectUriIsBlockingOrUnBlocking = (uri: string) =>
  createSelector(selectBlockingByUri, selectUnBlockingByUri, (blockingByUri, unBlockingByUri) => {
    return blockingByUri[uri] || unBlockingByUri[uri];
  });

export const makeSelectSuperChatDataForUri = (uri: string) =>
  createSelector(selectSuperchatsByUri, (byUri) => {
    return byUri[uri];
  });

export const makeSelectSuperChatsForUri = (uri: string) =>
  createSelector(makeSelectSuperChatDataForUri(uri), (superChatData) => {
    if (!superChatData) {
      return undefined;
    }

    return superChatData.comments;
  });

export const makeSelectSuperChatTotalAmountForUri = (uri: string) =>
  createSelector(makeSelectSuperChatDataForUri(uri), (superChatData) => {
    if (!superChatData) {
      return 0;
    }

    return superChatData.totalAmount;
  });

export const makeSelectCommentsDisabledForUri = (uri: string) =>
  createSelector(selectCommentsDisabledChannelIds, makeSelectClaimForUri(uri), (commentsDisabledChannelIds, claim) => {
    const channelClaim = !claim
      ? null
      : claim.value_type === 'channel'
      ? claim
      : claim.signing_channel && claim.is_channel_signature_valid
      ? claim.signing_channel
      : null;
    return channelClaim && channelClaim.claim_id && commentsDisabledChannelIds.includes(channelClaim.claim_id);
  });
