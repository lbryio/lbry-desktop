// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: CommentsState = {
  commentById: {}, // commentId -> Comment
  byId: {}, // ClaimID -> list of comments
  repliesByParentId: {}, // ParentCommentID -> list of reply comments
  topLevelCommentsById: {}, // ClaimID -> list of top level comments
  commentsByUri: {}, // URI -> claimId
  isLoading: false,
  isCommenting: false,
  myComments: undefined,
  isFetchingReacts: false,
  pendingCommentReactions: [],
  typesReacting: [],
  myReactsByCommentId: undefined,
  othersReactsByCommentId: undefined,
  moderationBlockList: undefined,
  fetchingModerationBlockList: false,
  blockingByUri: {},
  unBlockingByUri: {},
};

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
      const { comment, claimId, uri }: { comment: Comment, claimId: string, uri: string } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const repliesByParentId = Object.assign({}, state.repliesByParentId); // {ParentCommentID -> [commentIds...] } list of reply comments
      const commentsByUri = Object.assign({}, state.commentsByUri);
      const comments = byId[claimId] || [];
      const newCommentIds = comments.slice();

      // add the comment by its ID
      commentById[comment.comment_id] = comment;

      // push the comment_id to the top of ID list
      newCommentIds.unshift(comment.comment_id);
      byId[claimId] = newCommentIds;

      if (comment['parent_id']) {
        if (!repliesByParentId[comment.parent_id]) {
          repliesByParentId[comment.parent_id] = [comment.comment_id];
        } else {
          repliesByParentId[comment.parent_id].unshift(comment.comment_id);
        }
      } else {
        if (!topLevelCommentsById[claimId]) {
          commentsByUri[uri] = claimId;
          topLevelCommentsById[claimId] = [comment.comment_id];
        } else {
          topLevelCommentsById[claimId].unshift(comment.comment_id);
        }
      }
      return {
        ...state,
        topLevelCommentsById,
        repliesByParentId,
        commentById,
        byId,
        commentsByUri,
        isLoading: false,
        isCommenting: false,
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
      const { myReactions, othersReactions } = action.data;
      const myReacts = Object.assign({}, state.myReactsByCommentId);
      const othersReacts = Object.assign({}, state.othersReactsByCommentId);
      if (myReactions) {
        Object.entries(myReactions).forEach(([commentId, reactions]) => {
          myReacts[commentId] = Object.entries(reactions).reduce((acc, [name, count]) => {
            if (count === 1) {
              acc.push(name);
            }
            return acc;
          }, []);
        });
      }
      if (othersReactions) {
        Object.entries(othersReactions).forEach(([commentId, reactions]) => {
          othersReacts[commentId] = reactions;
        });
      }

      return {
        ...state,
        isFetchingReacts: false,
        myReactsByCommentId: myReacts,
        othersReactsByCommentId: othersReacts,
      };
    },

    [ACTIONS.COMMENT_LIST_STARTED]: (state) => ({ ...state, isLoading: true }),

    [ACTIONS.COMMENT_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const { comments, claimId, uri } = action.data;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const commentsByUri = Object.assign({}, state.commentsByUri);

      const tempRepliesByParent = {};
      const topLevelComments = [];
      if (comments) {
        // we use an Array to preserve order of listing
        // in reality this doesn't matter and we can just
        // sort comments by their timestamp
        const commentIds = Array(comments.length);

        // map the comment_ids to the new comments
        for (let i = 0; i < comments.length; i++) {
          const comment = comments[i];
          if (comment['parent_id']) {
            if (!tempRepliesByParent[comment.parent_id]) {
              tempRepliesByParent[comment.parent_id] = [comment.comment_id];
            } else {
              tempRepliesByParent[comment.parent_id].push(comment.comment_id);
            }
          } else {
            commentById[comment.comment_id] = comment;
            topLevelComments.push(comment.comment_id);
          }
          commentIds[i] = comments[i].comment_id;
          commentById[commentIds[i]] = comments[i];
        }
        topLevelCommentsById[claimId] = topLevelComments;

        byId[claimId] = commentIds;
        commentsByUri[uri] = claimId;
      }

      const repliesByParentId = Object.assign({}, state.repliesByParentId, tempRepliesByParent); // {ParentCommentID -> [commentIds...] } list of reply comments

      return {
        ...state,
        topLevelCommentsById,
        repliesByParentId,
        byId,
        commentById,
        commentsByUri,
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
    [ACTIONS.COMMENT_ABANDON_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    [ACTIONS.COMMENT_ABANDON_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment_id } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);

      // to remove the comment and its references
      const claimId = commentById[comment_id].claim_id;
      for (let i = 0; i < byId[claimId].length; i++) {
        if (byId[claimId][i] === comment_id) {
          byId[claimId].splice(i, 1);
          break;
        }
      }
      delete commentById[comment_id];

      return {
        ...state,
        commentById,
        byId,
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
    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationBlockList: true,
    }),
    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const { blockList } = action.data;

      return {
        ...state,
        moderationBlockList: blockList,
        fetchingModerationBlockList: false,
      };
    },
    [ACTIONS.COMMENT_MODERATION_BLOCK_LIST_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      fetchingModerationBlockList: false,
    }),

    [ACTIONS.COMMENT_MODERATION_BLOCK_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      blockingByUri: {
        ...state.blockingByUri,
        [action.data.uri]: true,
      },
    }),

    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      unBlockingByUri: {
        ...state.unBlockingByUri,
        [action.data.uri]: true,
      },
    }),
    [ACTIONS.COMMENT_MODERATION_BLOCK_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      blockingByUri: {
        ...state.blockingByUri,
        [action.data.uri]: false,
      },
    }),

    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      unBlockingByUri: {
        ...state.unBlockingByUri,
        [action.data.uri]: false,
      },
    }),

    [ACTIONS.COMMENT_MODERATION_BLOCK_COMPLETE]: (state: CommentsState, action: any) => {
      const { channelUri } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const blockingByUri = Object.assign({}, state.blockingByUri);
      const moderationBlockList = state.moderationBlockList || [];
      const newModerationBlockList = moderationBlockList.slice();

      for (const commentId in commentById) {
        const comment = commentById[commentId];

        if (channelUri === comment.channel_url) {
          delete commentById[comment.comment_id];
        }
      }

      delete blockingByUri[channelUri];

      newModerationBlockList.push(channelUri);

      return {
        ...state,
        commentById,
        blockingByUri,
        moderationBlockList: newModerationBlockList,
      };
    },
    [ACTIONS.COMMENT_MODERATION_UN_BLOCK_COMPLETE]: (state: CommentsState, action: any) => {
      const { channelUri } = action.data;
      const unBlockingByUri = Object.assign(state.unBlockingByUri, {});
      const moderationBlockList = state.moderationBlockList || [];
      const newModerationBlockList = moderationBlockList.slice().filter((uri) => uri !== channelUri);

      delete unBlockingByUri[channelUri];

      return {
        ...state,
        unBlockingByUri,
        moderationBlockList: newModerationBlockList,
      };
    },
  },
  defaultState
);
