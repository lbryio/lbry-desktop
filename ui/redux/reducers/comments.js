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
      const { comment, claimId }: { comment: Comment, claimId: string } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const topLevelCommentsById = Object.assign({}, state.topLevelCommentsById); // was byId {ClaimId -> [commentIds...]}
      const repliesByParentId = Object.assign({}, state.repliesByParentId); // {ParentCommentID -> [commentIds...] } list of reply comments
      const comments = byId[claimId];
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
        isCommenting: false,
      };
    },

    [ACTIONS.COMMENT_LIST_STARTED]: state => ({ ...state, isLoading: true }),

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
    // do nothing
    [ACTIONS.COMMENT_ABANDON_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isCommenting: false,
    }),
    // do nothing
    [ACTIONS.COMMENT_UPDATE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isCommenting: true,
    }),
    // replace existing comment with comment returned here under its comment_id
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
    // nothing can be done here
    [ACTIONS.COMMENT_UPDATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isCmmenting: false,
    }),
    // nothing can really be done here
    [ACTIONS.COMMENT_HIDE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    [ACTIONS.COMMENT_HIDE_COMPLETED]: (state: CommentsState, action: any) => ({
      ...state, // todo: add HiddenComments state & create selectors
      isLoading: false,
    }),
    // nothing can be done here
    [ACTIONS.COMMENT_HIDE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),
  },
  defaultState
);
