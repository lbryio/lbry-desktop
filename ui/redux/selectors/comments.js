// @flow
import * as SETTINGS from 'constants/settings';
import { createSelector } from 'reselect';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { selectBlacklistedOutpointMap, selectFilteredOutpointMap } from 'lbryinc';
import { selectClaimsById, isClaimNsfw, selectMyActiveClaims } from 'lbry-redux';

const selectState = state => state.comments || {};

export const selectCommentsById = createSelector(selectState, state => state.commentById || {});

export const selectIsFetchingComments = createSelector(selectState, state => state.isLoading);

export const selectIsPostingComment = createSelector(selectState, state => state.isCommenting);

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

export const selectTopLevelCommentsByClaimId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byClaimId = state.topLevelCommentsById || {};
  const comments = {};

  // replace every comment_id in the list with the actual comment object
  Object.keys(byClaimId).forEach(claimId => {
    const commentIds = byClaimId[claimId];

    comments[claimId] = Array(commentIds === null ? 0 : commentIds.length);
    for (let i = 0; i < commentIds.length; i++) {
      comments[claimId][i] = byId[commentIds[i]];
    }
  });

  return comments;
});

export const makeSelectCommentForCommentId = (commentId: string) =>
  createSelector(selectCommentsById, comments => comments[commentId]);

export const selectRepliesByParentId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byParentId = state.repliesByParentId || {};
  const comments = {};

  // replace every comment_id in the list with the actual comment object
  Object.keys(byParentId).forEach(id => {
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
export const selectCommentsByUri = createSelector(selectState, state => {
  const byUri = state.commentsByUri || {};
  const comments = {};
  Object.keys(byUri).forEach(uri => {
    const claimId = byUri[uri];
    if (claimId === null) {
      comments[uri] = null;
    } else {
      comments[uri] = claimId;
    }
  });

  return comments;
});

export const makeSelectCommentsForUri = (uri: string) =>
  createSelector(
    selectCommentsByClaimId,
    selectCommentsByUri,
    selectClaimsById,
    selectMyActiveClaims,
    selectBlockedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    makeSelectClientSetting(SETTINGS.SHOW_MATURE),
    (byClaimId, byUri, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];

      return comments
        ? comments.filter(comment => {
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
    selectBlockedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    makeSelectClientSetting(SETTINGS.SHOW_MATURE),
    (byClaimId, byUri, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];

      return comments
        ? comments.filter(comment => {
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
    selectBlockedChannels,
    selectBlacklistedOutpointMap,
    selectFilteredOutpointMap,
    makeSelectClientSetting(SETTINGS.SHOW_MATURE),
    (state, commentsById, claimsById, myClaims, blockedChannels, blacklistedMap, filteredMap, showMatureContent) => {
      // const claimId = byUri[uri]; // just parentId (id)
      const replyIdsByParentId = state.repliesByParentId;
      const replyIdsForParent = replyIdsByParentId[id] || [];
      if (!replyIdsForParent.length) return null;

      const comments = [];
      replyIdsForParent.forEach(cid => {
        comments.push(commentsById[cid]);
      });
      // const comments = byParentId && byParentId[id];

      return comments
        ? comments.filter(comment => {
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
