// @flow
import { createSelector } from 'reselect';
import { createCachedSelector } from 're-reselect';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectBlacklistedOutpointMap, selectFilteredOutpointMap } from 'lbryinc';
import { selectClaimsById, selectMyClaimIdsRaw, selectClaimIdForUri } from 'redux/selectors/claims';
import { isClaimNsfw } from 'util/claim';

type State = { claims: any, comments: CommentsState };

const selectState = (state) => state.comments || {};

export const selectCommentsById = (state: State) => selectState(state).commentById || {};
export const selectCommentIdsByClaimId = (state: State) => selectState(state).byId;
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

export const selectPinnedCommentsById = (state: State) => selectState(state).pinnedCommentsById;
export const selectPinnedCommentsForUri = createCachedSelector(
  selectClaimIdForUri,
  selectCommentsById,
  selectPinnedCommentsById,
  (state, uri) => uri,
  (claimId, byId, pinnedCommentsById, uri) => {
    const pinnedCommentIds = pinnedCommentsById && pinnedCommentsById[claimId];
    const pinnedComments = [];

    if (pinnedCommentIds) {
      pinnedCommentIds.forEach((commentId) => {
        pinnedComments.push(byId[commentId]);
      });
    }

    return pinnedComments;
  }
)((state, uri) => String(uri));

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

export const selectSuperchatsByUri = (state: State) => selectState(state).superChatsByUri;

export const selectTopLevelCommentsByClaimId = createSelector(
  (state) => selectState(state).topLevelCommentsById,
  selectCommentsById,
  (topLevelCommentsById, byId) => {
    const byClaimId = topLevelCommentsById || {};
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
  }
);

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

export const selectLinkedCommentAncestors = (state: State) => selectState(state).linkedCommentAncestors;

export const selectCommentIdsForUri = (state: State, uri: string) => {
  const claimId = selectClaimIdForUri(state, uri);
  const commentIdsByClaimId = selectCommentIdsByClaimId(state);
  return commentIdsByClaimId[claimId];
};

const filterCommentsDepOnList = {
  claimsById: selectClaimsById,
  myClaimIds: selectMyClaimIdsRaw,
  mutedChannels: selectMutedChannels,
  personalBlockList: selectModerationBlockList,
  blacklistedMap: selectBlacklistedOutpointMap,
  filteredMap: selectFilteredOutpointMap,
  showMatureContent: selectShowMatureContent,
};

const filterCommentsPropKeys = Object.keys(filterCommentsDepOnList);

export const selectPendingCommentReacts = (state: State) => selectState(state).pendingCommentReactions;
export const selectSettingsByChannelId = (state: State) => selectState(state).settingsByChannelId;
export const selectFetchingCreatorSettings = (state: State) => selectState(state).fetchingSettings;
export const selectFetchingBlockedWords = (state: State) => selectState(state).fetchingBlockedWords;

export const selectCommentsForUri = createCachedSelector(
  (state, uri) => uri,
  selectCommentsByClaimId,
  selectClaimIdForUri,
  ...Object.values(filterCommentsDepOnList),
  (uri, byClaimId, claimId, ...filterInputs) => {
    const comments = byClaimId && byClaimId[claimId];
    return filterComments(comments, claimId, filterInputs);
  }
)((state, uri) => String(uri));

export const selectTopLevelCommentsForUri = createCachedSelector(
  (state, uri) => uri,
  (state, uri, maxCount) => maxCount,
  selectTopLevelCommentsByClaimId,
  selectClaimIdForUri,
  ...Object.values(filterCommentsDepOnList),
  (uri, maxCount = -1, byClaimId, claimId, ...filterInputs) => {
    const comments = byClaimId && byClaimId[claimId];
    const filtered = filterComments(comments, claimId, filterInputs);
    return maxCount > 0 ? filtered.slice(0, maxCount) : filtered;
  }
)((state, uri, maxCount = -1) => `${String(uri)}:${maxCount}`);

export const makeSelectTopLevelTotalPagesForUri = (uri: string) =>
  createSelector(selectState, selectCommentsByUri, (state, byUri) => {
    const claimId = byUri[uri];
    return state.topLevelTotalPagesById[claimId] || 0;
  });

export const selectRepliesForParentId = createCachedSelector(
  (state, id) => id,
  (state) => selectState(state).repliesByParentId,
  selectCommentsById,
  ...Object.values(filterCommentsDepOnList),
  (id, repliesByParentId, commentsById, ...filterInputs) => {
    // const claimId = byUri[uri]; // just parentId (id)
    const replyIdsForParent = repliesByParentId[id] || [];
    if (!replyIdsForParent.length) return null;

    const comments = [];
    replyIdsForParent.forEach((cid) => {
      comments.push(commentsById[cid]);
    });
    // const comments = byParentId && byParentId[id];

    return filterComments(comments, undefined, filterInputs);
  }
)((state, id: string) => String(id));

/**
 * filterComments
 *
 * @param comments List of comments to filter.
 * @param claimId The claim that `comments` reside in.
 * @param filterInputs Values returned by filterCommentsDepOnList.
 */
const filterComments = (comments: Array<Comment>, claimId?: string, filterInputs: any) => {
  const filterProps = filterInputs.reduce(function (acc, cur, i) {
    acc[filterCommentsPropKeys[i]] = cur;
    return acc;
  }, {});

  const {
    claimsById,
    myClaimIds,
    mutedChannels,
    personalBlockList,
    blacklistedMap,
    filteredMap,
    showMatureContent,
  } = filterProps;

  return comments
    ? comments.filter((comment) => {
        if (!comment) {
          // It may have been recently deleted after being blocked
          return false;
        }

        const channelClaim = claimsById[comment.channel_id];

        // Return comment if `channelClaim` doesn't exist so the component knows to resolve the author
        if (channelClaim) {
          if (myClaimIds && myClaimIds.size > 0) {
            const claimIsMine = channelClaim.is_my_output || myClaimIds.includes(channelClaim.claim_id);
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
          const claimIdIsMine = myClaimIds && myClaimIds.size > 0 && myClaimIds.includes(claimId);
          if (!claimIdIsMine) {
            if (personalBlockList.includes(comment.channel_url)) {
              return false;
            }
          }
        }

        return !mutedChannels.includes(comment.channel_url);
      })
    : [];
};

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

export const selectSuperChatDataForUri = (state: State, uri: string) => {
  const byUri = selectSuperchatsByUri(state);
  return byUri[uri];
};

export const selectSuperChatsForUri = (state: State, uri: string) => {
  const superChatData = selectSuperChatDataForUri(state, uri);
  return superChatData ? superChatData.comments : undefined;
};

export const selectSuperChatTotalAmountForUri = (state: State, uri: string) => {
  const superChatData = selectSuperChatDataForUri(state, uri);
  return superChatData ? superChatData.totalAmount : 0;
};
