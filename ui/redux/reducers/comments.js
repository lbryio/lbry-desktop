// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';
import { BLOCK_LEVEL } from 'constants/comment';
import { isURIEqual } from 'util/lbryURI';

// See 'CommentsState' for documentation.
const defaultState: CommentsState = {
  commentById: {},
  byId: {},
  totalCommentsById: {},
  repliesByParentId: {},
  repliesTotalPagesByParentId: {},
  topLevelCommentsById: {},
  topLevelTotalPagesById: {},
  topLevelTotalCommentsById: {},
  // TODO:
  // Remove commentsByUri
  // It is not needed and doesn't provide anything but confusion
  commentsByUri: {}, // URI -> claimId
  fetchedCommentAncestors: {},
  superChatsByUri: {},
  pinnedCommentsById: {},
  isLoading: false,
  isLoadingById: false,
  isLoadingByParentId: {},
  isCommenting: false,
  myComments: undefined,
  isFetchingReacts: false,
  pendingCommentReactions: [],
  typesReacting: [],
  myReactsByCommentId: undefined,
  othersReactsByCommentId: undefined,
  moderationBlockList: undefined,
  adminBlockList: undefined,
  moderatorBlockList: undefined,
  moderatorBlockListDelegatorsMap: {},
  fetchingModerationBlockList: false,
  moderationDelegatesById: {},
  fetchingModerationDelegates: false,
  moderationDelegatorsById: {},
  fetchingModerationDelegators: false,
  blockingByUri: {},
  unBlockingByUri: {},
  personalTimeoutMap: {},
  adminTimeoutMap: {},
  moderatorTimeoutMap: {},
  togglingForDelegatorMap: {},
  settingsByChannelId: {},
  fetchingSettings: false,
  fetchingBlockedWords: false,
  myCommentedChannelIdsById: {},
};

// ****************************************************************************
// Immutable helpers
// ****************************************************************************

function immPushToArrayInObject(obj, key, valueToPush) {
  if (!obj[key]) {
    obj[key] = [valueToPush];
  } else if (!obj[key].includes(valueToPush)) {
    // Filter duplicates
    obj[key] = obj[key].concat(valueToPush);
  }
}

function immConcatToArrayInObject(obj, key, arrayToMerge) {
  if (obj[key]) {
    obj[key] = obj[key].concat(arrayToMerge);
  } else {
    obj[key] = arrayToMerge;
  }
}

function immPrefixArrayInObject(obj, key, valueToInsert) {
  if (obj[key]) {
    obj[key] = [valueToInsert, ...obj[key]];
  } else {
    obj[key] = [valueToInsert];
  }
}

// ****************************************************************************
// ****************************************************************************

export default handleActions(
  {
    [ACTIONS.COMMENT_CREATE_STARTED]: (state: CommentsState, action: any): CommentsState => ({
      ...state,
      isCommenting: true,
    }),

    [ACTIONS.COMMENT_CREATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isCommenting: false,
    }),

    [ACTIONS.COMMENT_CREATE_COMPLETED]: (state: CommentsState, action: any): CommentsState => {
      const {
        comment,
        claimId,
        uri,
        livestream,
      }: { comment: Comment, claimId: string, uri: string, livestream: boolean } = action.data;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const totalCommentsById = Object.assign({}, state.totalCommentsById);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const repliesByParentId = Object.assign({}, state.repliesByParentId); // {ParentCommentID -> [commentIds...] } list of reply comments
      const commentsByUri = Object.assign({}, state.commentsByUri);
      const comments = byId[claimId] || [];
      const newCommentIds = comments.slice();

      // If it was created during a livestream, let the websocket handler perform the state update
      if (!livestream) {
        // add the comment by its ID
        commentById[comment.comment_id] = comment;

        // push the comment_id to the top of ID list
        newCommentIds.unshift(comment.comment_id);
        byId[claimId] = newCommentIds;

        if (totalCommentsById.hasOwnProperty(claimId)) {
          totalCommentsById[claimId] += 1;
        }

        if (comment['parent_id']) {
          if (!repliesByParentId[comment.parent_id]) {
            repliesByParentId[comment.parent_id] = [comment.comment_id];
          } else {
            repliesByParentId[comment.parent_id].unshift(comment.comment_id);
          }

          // Update the parent's "replies" value
          if (commentById[comment.parent_id]) {
            commentById[comment.parent_id].replies = (commentById[comment.parent_id].replies || 0) + 1;
          }
        } else {
          if (!topLevelCommentsById[claimId]) {
            commentsByUri[uri] = claimId;
            topLevelCommentsById[claimId] = [comment.comment_id];
          } else {
            topLevelCommentsById[claimId].unshift(comment.comment_id);
          }
        }
      }

      let myCommentedChannelIdsById;
      const commentedChannelIds = (state.myCommentedChannelIdsById[claimId] || []).slice();
      if (!commentedChannelIds.includes(comment.channel_id)) {
        commentedChannelIds.push(comment.channel_id);
        myCommentedChannelIdsById = {
          ...state.myCommentedChannelIdsById,
          [claimId]: commentedChannelIds,
        };
      }

      return {
        ...state,
        topLevelCommentsById,
        repliesByParentId,
        commentById,
        byId,
        totalCommentsById,
        commentsByUri,
        isLoading: false,
        isCommenting: false,
        myCommentedChannelIdsById: myCommentedChannelIdsById || state.myCommentedChannelIdsById,
      };
    },

    [ACTIONS.COMMENT_REACTION_LIST_STARTED]: (state: CommentsState, action: any): CommentsState => ({
      ...state,
      isFetchingReacts: true,
    }),

    [ACTIONS.COMMENT_REACTION_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isFetchingReacts: false,
    }),

    [ACTIONS.COMMENT_REACT_FAILED]: (state: CommentsState, action: any): CommentsState => {
      const commentReaction = action.data; // String: reactionHash + type
      const newReactingTypes = new Set(state.pendingCommentReactions);
      newReactingTypes.delete(commentReaction);

      return {
        ...state,
        pendingCommentReactions: Array.from(newReactingTypes),
      };
    },

    [ACTIONS.COMMENT_REACT_STARTED]: (state: CommentsState, action: any): CommentsState => {
      const commentReaction = action.data;
      const newReactingTypes = new Set(state.pendingCommentReactions);
      newReactingTypes.add(commentReaction);

      return {
        ...state,
        pendingCommentReactions: Array.from(newReactingTypes),
      };
    },

    [ACTIONS.COMMENT_REACT_COMPLETED]: (state: CommentsState, action: any): CommentsState => {
      const commentReaction = action.data; // String: reactionHash + type
      const newReactingTypes = new Set(state.pendingCommentReactions);
      newReactingTypes.delete(commentReaction);

      return {
        ...state,
        pendingCommentReactions: Array.from(newReactingTypes),
      };
    },

    [ACTIONS.COMMENT_REACTION_LIST_COMPLETED]: (state: CommentsState, action: any): CommentsState => {
      const { myReactions, othersReactions, channelId, commentIds } = action.data;
      const myReacts = Object.assign({}, state.myReactsByCommentId);
      const othersReacts = Object.assign({}, state.othersReactsByCommentId);

      const myReactionsEntries = myReactions ? Object.entries(myReactions) : [];
      const othersReactionsEntries = othersReactions ? Object.entries(othersReactions) : [];

      if (myReactionsEntries.length > 0) {
        myReactionsEntries.forEach(([commentId, reactions]) => {
          const key = channelId ? `${commentId}:${channelId}` : commentId;
          myReacts[key] = Object.entries(reactions).reduce((acc, [name, count]) => {
            if (count === 1) {
              acc.push(name);
            }
            return acc;
          }, []);
        });
      } else {
        commentIds.forEach((commentId) => {
          const key = channelId ? `${commentId}:${channelId}` : commentId;
          myReacts[key] = [];
        });
      }

      if (othersReactionsEntries.length > 0) {
        othersReactionsEntries.forEach(([commentId, reactions]) => {
          const key = channelId ? `${commentId}:${channelId}` : commentId;
          othersReacts[key] = reactions;
        });
      } else {
        commentIds.forEach((commentId) => {
          const key = channelId ? `${commentId}:${channelId}` : commentId;
          othersReacts[key] = {};
        });
      }

      return {
        ...state,
        isFetchingReacts: false,
        myReactsByCommentId: myReacts,
        othersReactsByCommentId: othersReacts,
      };
    },

    [ACTIONS.COMMENT_LIST_STARTED]: (state, action: any) => {
      const { parentId } = action.data;
      const isLoadingByParentId = Object.assign({}, state.isLoadingByParentId);
      if (parentId) {
        isLoadingByParentId[parentId] = true;
      }

      return {
        ...state,
        isLoading: true,
        isLoadingByParentId,
      };
    },

    [ACTIONS.COMMENT_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const {
        comments,
        parentId,
        totalItems,
        totalFilteredItems,
        totalPages,
        claimId,
        uri,
        disabled,
        creatorClaimId,
      } = action.data;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const topLevelTotalCommentsById = Object.assign({}, state.topLevelTotalCommentsById);
      const topLevelTotalPagesById = Object.assign({}, state.topLevelTotalPagesById);
      const commentsByUri = Object.assign({}, state.commentsByUri);
      const repliesByParentId = Object.assign({}, state.repliesByParentId);
      const totalCommentsById = Object.assign({}, state.totalCommentsById);
      const pinnedCommentsById = Object.assign({}, state.pinnedCommentsById);
      const repliesTotalPagesByParentId = Object.assign({}, state.repliesTotalPagesByParentId);
      const isLoadingByParentId = Object.assign({}, state.isLoadingByParentId);
      const settingsByChannelId = Object.assign({}, state.settingsByChannelId);

      settingsByChannelId[creatorClaimId] = {
        ...(settingsByChannelId[creatorClaimId] || {}),
        comments_enabled: !disabled,
      };

      if (parentId) {
        isLoadingByParentId[parentId] = false;
      }

      if (!disabled) {
        if (parentId) {
          repliesTotalPagesByParentId[parentId] = totalPages;
        } else {
          totalCommentsById[claimId] = totalItems;
          topLevelTotalCommentsById[claimId] = totalFilteredItems;
          topLevelTotalPagesById[claimId] = totalPages;
        }

        const commonUpdateAction = (comment, commentById, commentIds, index) => {
          // map the comment_ids to the new comments
          commentById[comment.comment_id] = comment;
          commentIds[index] = comment.comment_id;
        };

        if (comments) {
          // we use an Array to preserve order of listing
          // in reality this doesn't matter and we can just
          // sort comments by their timestamp
          const commentIds = Array(comments.length);

          // --- Top-level comments ---
          if (!parentId) {
            for (let i = 0; i < comments.length; ++i) {
              const comment = comments[i];
              commonUpdateAction(comment, commentById, commentIds, i);
              if (comment.is_pinned) {
                immPushToArrayInObject(pinnedCommentsById, claimId, comment.comment_id);
              } else {
                immPushToArrayInObject(topLevelCommentsById, claimId, comment.comment_id);
              }
            }
          }
          // --- Replies ---
          else {
            for (let i = 0; i < comments.length; ++i) {
              const comment = comments[i];
              commonUpdateAction(comment, commentById, commentIds, i);
              immPushToArrayInObject(repliesByParentId, parentId, comment.comment_id);
            }
          }

          immConcatToArrayInObject(byId, claimId, commentIds);
          commentsByUri[uri] = claimId;
        }
      }

      return {
        ...state,
        topLevelCommentsById,
        topLevelTotalCommentsById,
        topLevelTotalPagesById,
        repliesByParentId,
        totalCommentsById,
        pinnedCommentsById,
        repliesTotalPagesByParentId,
        byId,
        commentById,
        commentsByUri,
        isLoading: false,
        isLoadingByParentId,
        settingsByChannelId,
      };
    },

    [ACTIONS.COMMENT_BY_ID_STARTED]: (state) => ({ ...state, isLoadingById: true }),

    [ACTIONS.COMMENT_BY_ID_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment, ancestors } = action.data;
      const claimId = comment.claim_id;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const topLevelTotalCommentsById = Object.assign({}, state.topLevelTotalCommentsById);
      const topLevelTotalPagesById = Object.assign({}, state.topLevelTotalPagesById);
      const pinnedCommentsById = Object.assign({}, state.pinnedCommentsById);
      const repliesByParentId = Object.assign({}, state.repliesByParentId);
      const fetchedCommentAncestors = Object.assign({}, state.fetchedCommentAncestors);

      const updateStore = (comment, commentById, byId, repliesByParentId, topLevelCommentsById) => {
        commentById[comment.comment_id] = comment;
        immPrefixArrayInObject(byId, claimId, comment.comment_id);

        const parentId = comment.parent_id;
        if (comment.parent_id) {
          immPushToArrayInObject(repliesByParentId, parentId, comment.comment_id);
        } else {
          if (comment.is_pinned) {
            immPushToArrayInObject(pinnedCommentsById, claimId, comment.comment_id);
          } else {
            immPushToArrayInObject(topLevelCommentsById, claimId, comment.comment_id);
          }
        }
      };

      updateStore(comment, commentById, byId, repliesByParentId, topLevelCommentsById);

      if (ancestors) {
        ancestors.forEach((ancestor) => {
          updateStore(ancestor, commentById, byId, repliesByParentId, topLevelCommentsById);
          immPushToArrayInObject(fetchedCommentAncestors, comment.comment_id, ancestor.comment_id);
        });
      }

      return {
        ...state,
        isLoadingById: false,
        topLevelCommentsById,
        topLevelTotalCommentsById,
        topLevelTotalPagesById,
        pinnedCommentsById,
        repliesByParentId,
        byId,
        commentById,
        fetchedCommentAncestors,
      };
    },

    [ACTIONS.COMMENT_FETCH_MY_COMMENTED_CHANNELS_COMPLETE]: (state: CommentsState, action: any) => {
      const { contentClaimId, commentedChannelIds } = action.data;

      return {
        ...state,
        myCommentedChannelIdsById: {
          ...state.myCommentedChannelIdsById,
          [contentClaimId]: commentedChannelIds,
        },
      };
    },

    [ACTIONS.COMMENT_SUPER_CHAT_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
    [ACTIONS.COMMENT_SUPER_CHAT_LIST_STARTED]: (state) => ({ ...state, isLoading: true }),

    [ACTIONS.COMMENT_SUPER_CHAT_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const { comments, totalAmount, uri } = action.data;

      return {
        ...state,
        superChatsByUri: {
          ...state.superChatsByUri,
          [uri]: {
            comments,
            totalAmount,
          },
        },
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),

    [ACTIONS.COMMENT_LIST_RESET]: (state: CommentsState, action: any) => {
      const { claimId } = action.data;

      const byId = Object.assign({}, state.byId);
      const totalCommentsById = Object.assign({}, state.totalCommentsById);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const topLevelTotalCommentsById = Object.assign({}, state.topLevelTotalCommentsById);
      const topLevelTotalPagesById = Object.assign({}, state.topLevelTotalPagesById);
      const pinnedCommentsById = Object.assign({}, state.pinnedCommentsById);
      const myReacts = Object.assign({}, state.myReactsByCommentId);
      const othersReacts = Object.assign({}, state.othersReactsByCommentId);

      function deleteReacts(reactObj, commentIdsToRemove) {
        if (commentIdsToRemove && commentIdsToRemove.length > 0) {
          let reactionKeys = Object.keys(reactObj);
          reactionKeys.forEach((rk) => {
            const colonIndex = rk.indexOf(':');
            const commentId = colonIndex === -1 ? rk : rk.substring(0, colonIndex);
            if (commentIdsToRemove.includes(commentId)) {
              delete reactObj[rk];
            }
          });
        }
      }

      deleteReacts(myReacts, byId[claimId]);
      deleteReacts(othersReacts, byId[claimId]);

      delete byId[claimId];
      delete totalCommentsById[claimId];
      delete topLevelCommentsById[claimId];
      delete topLevelTotalCommentsById[claimId];
      delete topLevelTotalPagesById[claimId];
      delete pinnedCommentsById[claimId];

      return {
        ...state,
        byId,
        totalCommentsById,
        topLevelCommentsById,
        topLevelTotalCommentsById,
        topLevelTotalPagesById,
        pinnedCommentsById,
        myReactsByCommentId: myReacts,
        othersReactsByCommentId: othersReacts,
      };
    },

    [ACTIONS.COMMENT_RECEIVED]: (state: CommentsState, action: any) => {
      const { uri, claimId, comment } = action.data;
      const commentsByUri = Object.assign({}, state.commentsByUri);
      const commentsByClaimId = Object.assign({}, state.byId);
      const allCommentsById = Object.assign({}, state.commentById);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById);
      const superChatsByUri = Object.assign({}, state.superChatsByUri);
      const commentsForId = topLevelCommentsById[claimId];

      allCommentsById[comment.comment_id] = comment;
      commentsByUri[uri] = claimId;

      if (commentsForId) {
        const newCommentsForId = commentsForId.slice();
        const commentExists = newCommentsForId.includes(comment.comment_id);
        if (!commentExists) {
          newCommentsForId.unshift(comment.comment_id);
        }

        topLevelCommentsById[claimId] = newCommentsForId;
      } else {
        topLevelCommentsById[claimId] = [comment.comment_id];
      }

      // We don't care to keep existing lower level comments since this is just for livestreams
      commentsByClaimId[claimId] = topLevelCommentsById[claimId];

      if (comment.support_amount > 0) {
        const superChatForUri = superChatsByUri[uri];
        const superChatCommentsForUri = superChatForUri && superChatForUri.comments;

        let sortedSuperChatComments = [];
        let hasAddedNewComment = false;
        if (superChatCommentsForUri && superChatCommentsForUri.length > 0) {
          // Go for the entire length of superChatCommentsForUri since a comment will be added to this list
          for (var i = 0; i < superChatCommentsForUri.length; i++) {
            const existingSuperChat = superChatCommentsForUri[i];
            if (existingSuperChat.support_amount < comment.support_amount && !hasAddedNewComment) {
              hasAddedNewComment = true;
              sortedSuperChatComments.push(comment);
              sortedSuperChatComments.push(existingSuperChat);
            } else {
              sortedSuperChatComments.push(existingSuperChat);
            }

            // If the new superchat hasn't been added yet, it must be the smallest superchat in the list
            if (
              i === superChatCommentsForUri.length - 1 &&
              sortedSuperChatComments.length === superChatCommentsForUri.length
            ) {
              sortedSuperChatComments.push(comment);
            }
          }

          superChatsByUri[uri].comments = sortedSuperChatComments;
          superChatsByUri[uri].totalAmount += comment.support_amount;
        } else {
          superChatsByUri[uri] = { comments: [comment], totalAmount: comment.support_amount };
        }
      }

      return {
        ...state,
        byId: commentsByClaimId,
        commentById: allCommentsById,
        commentsByUri,
        topLevelCommentsById,
        superChatsByUri,
      };
    },

    [ACTIONS.COMMENT_ABANDON_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    [ACTIONS.COMMENT_ABANDON_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment_id } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const repliesByParentId = Object.assign({}, state.repliesByParentId); // {ParentCommentID -> [commentIds...] } list of reply comments
      const totalCommentsById = Object.assign({}, state.totalCommentsById);

      const comment = commentById[comment_id];

      // to remove the comment and its references
      const claimId = comment.claim_id;

      if (byId[claimId]) {
        for (let i = 0; i < byId[claimId].length; i++) {
          if (byId[claimId][i] === comment_id) {
            // immutable update
            byId[claimId] = Array.from(byId[claimId]);
            byId[claimId].splice(i, 1);
            break;
          }
        }
      }

      // Update replies
      if (comment['parent_id'] && repliesByParentId[comment.parent_id]) {
        const index = repliesByParentId[comment.parent_id].indexOf(comment.comment_id);
        if (index > -1) {
          repliesByParentId[comment.parent_id].splice(index, 1);

          if (commentById[comment.parent_id]) {
            commentById[comment.parent_id].replies = Math.max(0, (commentById[comment.parent_id].replies || 0) - 1);
          }
        }
      }

      if (totalCommentsById.hasOwnProperty(claimId)) {
        totalCommentsById[claimId] = Math.max(0, totalCommentsById[claimId] - 1);
      }

      delete commentById[comment_id];

      return {
        ...state,
        commentById,
        byId,
        totalCommentsById,
        repliesByParentId,
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_ABANDON_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isCommenting: false,
    }),
    [ACTIONS.COMMENT_UPDATE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isCommenting: true,
    }),
    [ACTIONS.COMMENT_UPDATE_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment } = action.data;
      const commentById = Object.assign({}, state.commentById);
      commentById[comment.comment_id] = comment;

      return {
        ...state,
        commentById,
        isCommenting: false,
      };
    },
    [ACTIONS.COMMENT_UPDATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isCmmenting: false,
    }),

    [ACTIONS.COMMENT_PIN_COMPLETED]: (state: CommentsState, action: any) => {
      const { pinnedComment, claimId, unpin } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById);
      const pinnedCommentsById = Object.assign({}, state.pinnedCommentsById);

      if (pinnedComment) {
        if (topLevelCommentsById[claimId]) {
          const index = topLevelCommentsById[claimId].indexOf(pinnedComment.comment_id);
          if (index > -1) {
            topLevelCommentsById[claimId].splice(index, 1);
          }
        } else {
          topLevelCommentsById[claimId] = [];
        }

        if (pinnedCommentsById[claimId]) {
          const index = pinnedCommentsById[claimId].indexOf(pinnedComment.comment_id);
          if (index > -1) {
            pinnedCommentsById[claimId].splice(index, 1);
          }
        } else {
          pinnedCommentsById[claimId] = [];
        }

        if (unpin) {
          // Without the sort score, I have no idea where to put it. Just
          // dump it at the top. Users can refresh if they want it back to
          // the correct sorted position.
          topLevelCommentsById[claimId].unshift(pinnedComment.comment_id);
        } else {
          pinnedCommentsById[claimId].unshift(pinnedComment.comment_id);
        }

        if (commentById[pinnedComment.comment_id]) {
          // Commentron's `comment.Pin` response places the creator's credentials
          // in the 'channel_*' fields, which doesn't make sense. Maybe it is to
          // show who signed/pinned it, but even if so, it shouldn't overload
          // these variables which are already used by existing comment data structure.
          // Ensure we don't override the existing/correct values, but fallback
          // to whatever was given.
          const { channel_id, channel_name, channel_url } = commentById[pinnedComment.comment_id];
          commentById[pinnedComment.comment_id] = {
            ...pinnedComment,
            channel_id: channel_id || pinnedComment.channel_id,
            channel_name: channel_name || pinnedComment.channel_name,
            channel_url: channel_url || pinnedComment.channel_url,
          };
        } else {
          commentById[pinnedComment.comment_id] = pinnedComment;
        }
      }

      return {
        ...state,
        commentById,
        topLevelCommentsById,
        pinnedCommentsById,
      };
    },

    [ACTIONS.COMMENT_MARK_AS_REMOVED]: (state: CommentsState, action: any) => {
      const { comment_id } = action.data;
      const commentById = Object.assign({}, state.commentById);

      if (!commentById[comment_id]) {
        return state;
      }

      commentById[comment_id] = { ...commentById[comment_id], removed: true };
      return { ...state, commentById };
    },

    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationBlockList: true,
    }),
    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const {
        personalBlockList,
        adminBlockList,
        moderatorBlockList,
        moderatorBlockListDelegatorsMap,
        personalTimeoutMap,
        adminTimeoutMap,
        moderatorTimeoutMap,
      } = action.data;

      return {
        ...state,
        moderationBlockList: personalBlockList,
        adminBlockList: adminBlockList,
        moderatorBlockList: moderatorBlockList,
        moderatorBlockListDelegatorsMap,
        personalTimeoutMap,
        adminTimeoutMap,
        moderatorTimeoutMap,
        fetchingModerationBlockList: false,
      };
    },
    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationBlockList: false,
    }),

    [ACTIONS.COMMENT_MODERATION_BLOCK_STARTED]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;

      switch (blockLevel) {
        default:
        case BLOCK_LEVEL.SELF:
        case BLOCK_LEVEL.ADMIN:
          return {
            ...state,
            blockingByUri: {
              ...state.blockingByUri,
              [blockedUri]: true,
            },
          };

        case BLOCK_LEVEL.MODERATOR:
          const newMap = Object.assign({}, state.togglingForDelegatorMap);
          const togglingDelegatorsForBlockedUri = newMap[blockedUri];
          if (togglingDelegatorsForBlockedUri) {
            if (!togglingDelegatorsForBlockedUri.includes(creatorUri)) {
              togglingDelegatorsForBlockedUri.push(creatorUri);
            }
          } else {
            newMap[blockedUri] = [creatorUri];
          }

          return {
            ...state,
            togglingForDelegatorMap: newMap,
          };
      }
    },

    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_STARTED]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;

      switch (blockLevel) {
        default:
        case BLOCK_LEVEL.SELF:
        case BLOCK_LEVEL.ADMIN:
          return {
            ...state,
            unBlockingByUri: {
              ...state.unBlockingByUri,
              [blockedUri]: true,
            },
          };

        case BLOCK_LEVEL.MODERATOR:
          const newMap = Object.assign({}, state.togglingForDelegatorMap);
          const togglingDelegatorsForBlockedUri = newMap[blockedUri];
          if (togglingDelegatorsForBlockedUri) {
            if (!togglingDelegatorsForBlockedUri.includes(creatorUri)) {
              togglingDelegatorsForBlockedUri.push(creatorUri);
            }
          } else {
            newMap[blockedUri] = [creatorUri];
          }

          return {
            ...state,
            togglingForDelegatorMap: newMap,
          };
      }
    },

    [ACTIONS.COMMENT_MODERATION_BLOCK_FAILED]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;

      switch (blockLevel) {
        default:
        case BLOCK_LEVEL.SELF:
        case BLOCK_LEVEL.ADMIN:
          return {
            ...state,
            blockingByUri: {
              ...state.blockingByUri,
              [blockedUri]: false,
            },
          };

        case BLOCK_LEVEL.MODERATOR:
          const newMap = Object.assign({}, state.togglingForDelegatorMap);
          const togglingDelegatorsForBlockedUri = newMap[blockedUri];
          if (togglingDelegatorsForBlockedUri) {
            newMap[blockedUri] = togglingDelegatorsForBlockedUri.filter((x) => x !== creatorUri);
          }

          return {
            ...state,
            togglingForDelegatorMap: newMap,
          };
      }
    },

    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_FAILED]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;

      switch (blockLevel) {
        default:
        case BLOCK_LEVEL.SELF:
        case BLOCK_LEVEL.ADMIN:
          return {
            ...state,
            unBlockingByUri: {
              ...state.unBlockingByUri,
              [blockedUri]: false,
            },
          };

        case BLOCK_LEVEL.MODERATOR:
          const newMap = Object.assign({}, state.togglingForDelegatorMap);
          const togglingDelegatorsForBlockedUri = newMap[blockedUri];
          if (togglingDelegatorsForBlockedUri) {
            newMap[blockedUri] = togglingDelegatorsForBlockedUri.filter((x) => x !== creatorUri);
          }

          return {
            ...state,
            togglingForDelegatorMap: newMap,
          };
      }
    },

    [ACTIONS.COMMENT_MODERATION_BLOCK_COMPLETE]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const blockingByUri = Object.assign({}, state.blockingByUri);

      for (const commentId in commentById) {
        const comment = commentById[commentId];

        if (isURIEqual(blockedUri, comment.channel_url)) {
          delete commentById[comment.comment_id];
        }
      }

      switch (blockLevel) {
        case BLOCK_LEVEL.SELF: {
          const blockList = state.moderationBlockList || [];
          const newBlockList = blockList.slice();
          newBlockList.push(blockedUri);
          delete blockingByUri[blockedUri];

          return {
            ...state,
            commentById,
            blockingByUri,
            moderationBlockList: newBlockList,
          };
        }

        case BLOCK_LEVEL.MODERATOR: {
          const blockList = state.moderatorBlockList || [];
          const newBlockList = blockList.slice();

          // Update main block list
          if (!newBlockList.includes(blockedUri)) {
            newBlockList.push(blockedUri);
          }

          // Update list of delegators
          const moderatorBlockListDelegatorsMap = Object.assign({}, state.moderatorBlockListDelegatorsMap);
          const delegatorUrisForBlockedUri = moderatorBlockListDelegatorsMap[blockedUri];
          if (delegatorUrisForBlockedUri) {
            if (!delegatorUrisForBlockedUri.includes(creatorUri)) {
              delegatorUrisForBlockedUri.push(creatorUri);
            }
          } else {
            moderatorBlockListDelegatorsMap[blockedUri] = [creatorUri];
          }

          // Remove "toggling" flag
          const togglingMap = Object.assign({}, state.togglingForDelegatorMap);
          const togglingDelegatorsForBlockedUri = togglingMap[blockedUri];
          if (togglingDelegatorsForBlockedUri) {
            togglingMap[blockedUri] = togglingDelegatorsForBlockedUri.filter((x) => x !== creatorUri);
          }

          return {
            ...state,
            commentById,
            moderatorBlockList: newBlockList,
            moderatorBlockListDelegatorsMap,
            togglingForDelegatorMap: togglingMap,
          };
        }

        case BLOCK_LEVEL.ADMIN:
          const blockList = state.adminBlockList || [];
          const newBlockList = blockList.slice();
          newBlockList.push(blockedUri);
          delete blockingByUri[blockedUri];

          return {
            ...state,
            commentById,
            blockingByUri,
            adminBlockList: newBlockList,
          };
      }
    },
    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_COMPLETE]: (state: CommentsState, action: any) => {
      const { blockedUri, creatorUri, blockLevel } = action.data;
      const unBlockingByUri = Object.assign(state.unBlockingByUri, {});

      switch (blockLevel) {
        case BLOCK_LEVEL.SELF: {
          const blockList = state.moderationBlockList || [];
          delete unBlockingByUri[blockedUri];
          return {
            ...state,
            unBlockingByUri,
            moderationBlockList: blockList.slice().filter((uri) => uri !== blockedUri),
          };
        }

        case BLOCK_LEVEL.ADMIN: {
          const blockList = state.adminBlockList || [];
          delete unBlockingByUri[blockedUri];
          return {
            ...state,
            unBlockingByUri,
            adminBlockList: blockList.slice().filter((uri) => uri !== blockedUri),
          };
        }

        case BLOCK_LEVEL.MODERATOR: {
          const blockList = state.moderatorBlockList || [];
          const newBlockList = blockList.slice();
          const togglingMap = Object.assign({}, state.togglingForDelegatorMap);

          const moderatorBlockListDelegatorsMap = Object.assign({}, state.moderatorBlockListDelegatorsMap);
          const delegatorUrisForBlockedUri = moderatorBlockListDelegatorsMap[blockedUri];
          if (delegatorUrisForBlockedUri) {
            const index = delegatorUrisForBlockedUri.indexOf(creatorUri);
            if (index > -1) {
              // Remove from delegators list
              delegatorUrisForBlockedUri.splice(index, 1);

              // // Remove blocked entry if it was removed for all delegators
              // if (delegatorUrisForBlockedUri.length === 0) {
              //   delete moderatorBlockListDelegatorsMap[blockedUri];
              //   newBlockList = newBlockList.filter((uri) => uri !== blockedUri);
              // }

              // Remove from "toggling" flag
              const togglingDelegatorsForBlockedUri = togglingMap[blockedUri];
              if (togglingDelegatorsForBlockedUri) {
                togglingMap[blockedUri] = togglingDelegatorsForBlockedUri.filter((x) => x !== creatorUri);
              }
            }
          }

          return {
            ...state,
            moderatorBlockList: newBlockList,
            togglingForDelegatorMap: togglingMap,
          };
        }
      }
    },

    [ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationDelegates: true,
    }),
    [ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationDelegates: false,
    }),
    [ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_COMPLETED]: (state: CommentsState, action: any) => {
      const moderationDelegatesById = Object.assign({}, state.moderationDelegatesById);
      if (action.data.delegates) {
        moderationDelegatesById[action.data.id] = action.data.delegates.map((delegate) => {
          return {
            channelId: delegate.channel_id,
            channelName: delegate.channel_name,
          };
        });
      } else {
        moderationDelegatesById[action.data.id] = [];
      }

      return {
        ...state,
        fetchingModerationDelegates: false,
        moderationDelegatesById: moderationDelegatesById,
      };
    },

    [ACTIONS.COMMENT_MODERATION_AM_I_LIST_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationDelegators: true,
    }),

    [ACTIONS.COMMENT_MODERATION_AM_I_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationDelegators: true,
    }),

    [ACTIONS.COMMENT_MODERATION_AM_I_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      return {
        ...state,
        fetchingModerationDelegators: true,
        moderationDelegatorsById: action.data,
      };
    },

    [ACTIONS.COMMENT_FETCH_SETTINGS_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingSettings: true,
    }),
    [ACTIONS.COMMENT_FETCH_SETTINGS_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingSettings: false,
    }),
    [ACTIONS.COMMENT_FETCH_SETTINGS_COMPLETED]: (state: CommentsState, action: any) => {
      const { channelId, settings, partialUpdate } = action.data;
      const settingsByChannelId = Object.assign({}, state.settingsByChannelId);

      if (partialUpdate) {
        settingsByChannelId[channelId] = {
          // The existing may contain additional Creator Settings (e.g. 'words')
          ...(settingsByChannelId[channelId] || {}),
          // Spread new settings.
          ...settings,
        };
      } else {
        settingsByChannelId[channelId] = settings;
        if (settings.words) {
          settingsByChannelId[channelId].words = settings.words.split(',');
        }
      }

      return {
        ...state,
        settingsByChannelId,
        fetchingSettings: false,
      };
    },

    [ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingBlockedWords: true,
    }),
    [ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingBlockedWords: false,
    }),
    [ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_COMPLETED]: (state: CommentsState, action: any) => {
      const blockedWordsByChannelId = action.data;
      const settingsByChannelId = Object.assign({}, state.settingsByChannelId);

      // blockedWordsByChannelId: {string: [string]}
      Object.entries(blockedWordsByChannelId).forEach((x) => {
        const channelId = x[0];
        if (!settingsByChannelId[channelId]) {
          settingsByChannelId[channelId] = {};
        }
        settingsByChannelId[channelId].words = x[1];
      });

      return {
        ...state,
        settingsByChannelId,
        fetchingBlockedWords: false,
      };
    },
  },
  defaultState
);
