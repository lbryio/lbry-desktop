// @flow
import { createSelector } from 'reselect';
import { selectBlockedChannels } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints } from 'lbryinc';
import { selectClaimsById } from 'lbry-redux';

const selectState = state => state.comments || {};

export const selectCommentsById = createSelector(selectState, state => state.commentById || {});

export const selectIsFetchingComments = createSelector(selectState, state => state.isLoading);

export const selectCommentsByClaimId = createSelector(selectState, selectCommentsById, (state, byId) => {
  const byClaimId = state.byId || {};
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
    selectBlockedChannels,
    selectBlackListedOutpoints,
    (byClaimId, byUri, claimsById, blockedChannels, blacklistedOutpoints) => {
      const claimId = byUri[uri];
      const comments = byClaimId && byClaimId[claimId];
      const outpointMap = blacklistedOutpoints
        ? blacklistedOutpoints.reduce((acc, val) => {
            const outpoint = `${val.txid}:${val.nout}`;
            return {
              ...acc,
              [outpoint]: 1,
            };
          }, {})
        : {};

      return comments
        ? comments.filter(comment => {
            const channelClaim = claimsById[comment.channel_id];

            // Return comment if `channelClaim` doesn't exist so the component knows to resolve the author
            if (channelClaim) {
              const outpoint = `${channelClaim.txid}:${channelClaim.nout}`;
              if (outpointMap[outpoint]) {
                return false;
              }
            }

            console.log('?');
            return !blockedChannels.includes(comment.channel_url);
          })
        : [];
    }
  );
