// @flow
import { createSelector } from 'reselect';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectBlacklistedOutpointMap, selectFilteredOutpointMap } from 'lbryinc';
import { selectClaimsById, selectMyActiveClaims } from 'redux/selectors/claims';
import { isClaimNsfw } from 'util/claim';

type State = { comments: CommentsState };

const selectState = (state) => state.comments || {};

export const selectCommentsById = (state: State) => selectState(state).commentById || {};
export const selectIsFetchingComments = (state: State) => selectState(state).isLoading;
export const selectIsFetchingCommentsById = (state: State) => selectState(state).isLoadingById;
export const selectIsFetchingCommentsByParentId = (state: State) => selectState(state).isLoadingByParentId;
export const selectIsFetchingReacts = (state: State) => selectState(state).isFetchingReacts;

export const selectMyReacts = (state: State) => state.comments.myReactsByCommentId;
export const selectMyReactsForComment = (state: State, commentIdChannelId: string) => {
  // @commentIdChannelId: Format = 'commentId:MyChannelId'
  return state.comments.myReactsByCommentId && state.comments.myReactsByCommentId[commentIdChannelId];
};

export const selectOthersReacts = (state: State) => state.comments.othersReactsByCommentId;
export const selectOthersReactsForComment = (state: State, id: string) => {
  return state.comments.othersReactsByCommentId && state.comments.othersReactsByCommentId[id];
};

export const selectPinnedCommentsById = (state: State) => selectState(state).pinnedCommentsById;
export const makeSelectPinnedCommentsForUri = (uri: string) =>
  createSelector(
    selectCommentsByUri,
    selectCommentsById,
    selectPinnedCommentsById,
    (byUri, byId, pinnedCommentsById) => {
      const claimId = byUri[uri];
      const pinnedCommentIds = pinnedCommentsById && pinnedCommentsById[claimId];
      const pinnedComments = [];

      if (pinnedCommentIds) {
        pinnedCommentIds.forEach((commentId) => {
          pinnedComments.push(byId[commentId]);
        });
      }

      return pinnedComments;
    }
  );

export const selectModerationBlockList = createSelector(
  (state) => selectState(state).moderationBlockList,
  (moderationBlockList) => {
    return moderationBlockList ? moderationBlockList.reverse() : [];
  }
);
export const selectAdminBlockList = createSelector(selectState, (state) =>
  state.adminBlockList ? state.adminBlockList.reverse() : []
);
export const selectModeratorBlockList = createSelector(selectState, (state) =>
  state.moderatorBlockList ? state.moderatorBlockList.reverse() : []
);

export const selectPersonalTimeoutMap = (state: State) => selectState(state).personalTimeoutMap;
export const selectAdminTimeoutMap = (state: State) => selectState(state).adminTimeoutMap;
export const selectModeratorTimeoutMap = (state: State) => selectState(state).moderatorTimeoutMap;
export const selectModeratorBlockListDelegatorsMap = (state: State) =>
  selectState(state).moderatorBlockListDelegatorsMap;
export const selectTogglingForDelegatorMap = (state: State) => selectState(state).togglingForDelegatorMap;
export const selectBlockingByUri = (state: State) => selectState(state).blockingByUri;
export const selectUnBlockingByUri = (state: State) => selectState(state).unBlockingByUri;
export const selectFetchingModerationBlockList = (state: State) => selectState(state).fetchingModerationBlockList;
export const selectModerationDelegatesById = (state: State) => selectState(state).moderationDelegatesById;
export const selectIsFetchingModerationDelegates = (state: State) => selectState(state).fetchingModerationDelegates;
export const selectModerationDelegatorsById = (state: State) => selectState(state).moderationDelegatorsById;
export const selectIsFetchingModerationDelegators = (state: State) => selectState(state).fetchingModerationDelegators;

export const selectHasAdminChannel = createSelector(selectState, (state) => {
  const myChannelIds = Object.keys(state.moderationDelegatorsById);
  for (let i = 0; i < myChannelIds.length; ++i) {
    const id = myChannelIds[i];
    if (state.moderationDelegatorsById[id] && state.moderationDelegatorsById[id].global) {
      return true;
    }
  }
  return false;

  /// Lint doesn't like this:
  // return Object.values(state.moderationDelegatorsById).some((x) => x.global);
});

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

// no superchats?
export const selectSuperchatsByUri = (state: State) => selectState(state).superChatsByUri;

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

export const selectLinkedCommentAncestors = (state: State) => selectState(state).linkedCommentAncestors;

export const makeSelectCommentIdsForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, selectClaimsById, (state, byUri) => {
    const claimId = byUri[uri];
    return state.byId[claimId];
  });

export const selectPendingCommentReacts = (state: State) => selectState(state).pendingCommentReactions;
export const selectSettingsByChannelId = (state: State) => selectState(state).settingsByChannelId;
export const selectFetchingCreatorSettings = (state: State) => selectState(state).fetchingSettings;
export const selectFetchingBlockedWords = (state: State) => selectState(state).fetchingBlockedWords;

export const makeSelectCommentsForUri = (uri: string) =>
  createSelector(
    (state) => state,
    selectCommentsByClaimId,
    selectCommentsByUri,
    (state, byClaimId, byUri) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];
      return makeSelectFilteredComments(comments, claimId)(state);
    }
  );

export const makeSelectTopLevelCommentsForUri = (uri: string) =>
  createSelector(
    (state) => state,
    selectTopLevelCommentsByClaimId,
    selectCommentsByUri,
    (state, byClaimId, byUri) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];
      return makeSelectFilteredComments(comments, claimId)(state);
    }
  );

export const makeSelectTopLevelTotalCommentsForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, (state, byUri) => {
    const claimId = byUri[uri];
    return state.topLevelTotalCommentsById[claimId] || 0;
  });

export const makeSelectTopLevelTotalPagesForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, (state, byUri) => {
    const claimId = byUri[uri];
    return state.topLevelTotalPagesById[claimId] || 0;
  });

export const makeSelectRepliesForParentId = (id: string) =>
  createSelector(
    (state) => state,
    selectCommentsById,
    (state, commentsById) => {
      // const claimId = byUri[uri]; // just parentId (id)
      const replyIdsByParentId = state.comments.repliesByParentId;
      const replyIdsForParent = replyIdsByParentId[id] || [];
      if (!replyIdsForParent.length) return null;

      const comments = [];
      replyIdsForParent.forEach((cid) => {
        comments.push(commentsById[cid]);
      });
      // const comments = byParentId && byParentId[id];

      return makeSelectFilteredComments(comments)(state);
    }
  );

/**
 * makeSelectFilteredComments
 *
 * @param comments List of comments to filter.
 * @param claimId The claim that `comments` reside in.
 */
const makeSelectFilteredComments = (comments: Array<Comment>, claimId?: string) =>
  createSelector(
    selectClaimsById,
    selectMyActiveClaims,
    selectMutedChannels,
    selectModerationBlockList,
    selectAdminBlockList,
    selectModeratorBlockList,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    selectShowMatureContent,
    (
      claimsById,
      myClaims,
      mutedChannels,
      personalBlockList,
      adminBlockList,
      moderatorBlockList,
      blacklistedMap,
      filteredMap,
      showMatureContent
    ) => {
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

            if (claimId) {
              const claimIdIsMine = myClaims && myClaims.size > 0 && myClaims.has(claimId);
              if (!claimIdIsMine) {
                if (personalBlockList.includes(comment.channel_url) || adminBlockList.includes(comment.channel_url)) {
                  return false;
                }
              }
            }

            return !mutedChannels.includes(comment.channel_url);
          })
        : [];
    }
  );

export const makeSelectTotalReplyPagesForParentId = (parentId: string) =>
  createSelector(selectState, (state) => {
    return state.repliesTotalPagesByParentId[parentId] || 0;
  });

export const makeSelectTotalCommentsCountForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, (state, byUri) => {
    const claimId = byUri[uri];
    return state.totalCommentsById[claimId] || 0;
  });

// Personal list
export const makeSelectChannelIsBlocked = (uri: string) =>
  createSelector(selectModerationBlockList, (blockedChannelUris) => {
    if (!blockedChannelUris || !blockedChannelUris) {
      return false;
    }

    return blockedChannelUris.includes(uri);
  });

export const makeSelectChannelIsAdminBlocked = (uri: string) =>
  createSelector(selectAdminBlockList, (list) => {
    return list ? list.includes(uri) : false;
  });

export const makeSelectChannelIsModeratorBlocked = (uri: string) =>
  createSelector(selectModeratorBlockList, (list) => {
    return list ? list.includes(uri) : false;
  });

export const makeSelectChannelIsModeratorBlockedForCreator = (uri: string, creatorUri: string) =>
  createSelector(selectModeratorBlockList, selectModeratorBlockListDelegatorsMap, (blockList, delegatorsMap) => {
    if (!blockList) return false;
    return blockList.includes(uri) && delegatorsMap[uri] && delegatorsMap[uri].includes(creatorUri);
  });

export const makeSelectIsTogglingForDelegator = (uri: string, creatorUri: string) =>
  createSelector(selectTogglingForDelegatorMap, (togglingForDelegatorMap) => {
    return togglingForDelegatorMap[uri] && togglingForDelegatorMap[uri].includes(creatorUri);
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
