// @flow
import * as ACTIONS from 'constants/action_types';
import { handleActions } from 'util/redux-utils';

const defaultState: CommentsState = {
  commentById: {}, // commentId -> Comment
  byId: {}, // ClaimID -> list of comments
  commentsByUri: {}, // URI -> claimId
  isLoading: false,
  myComments: undefined,
};

export default handleActions(
  {
    [ACTIONS.COMMENT_CREATE_STARTED]: (state: CommentsState, action: any): CommentsState => ({
      ...state,
      isLoading: true,
    }),

    [ACTIONS.COMMENT_CREATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
    }),

    [ACTIONS.COMMENT_CREATE_COMPLETED]: (state: CommentsState, action: any): CommentsState => {
      const { comment, claimId, uri }: { comment: Comment, claimId: string, uri: string } = action.data;
      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const comments = byId[claimId] || [];
      const newCommentIds = comments.slice();
      const commentsByUri = Object.assign({}, state.commentsByUri);

      // add the comment by its ID
      commentById[comment.comment_id] = comment;

      // push the comment_id to the top of ID list
      newCommentIds.unshift(comment.comment_id);
      byId[claimId] = newCommentIds;

      if (!commentsByUri[uri]) {
        commentsByUri[uri] = claimId;
      }

      return {
        ...state,
        commentById,
        byId,
        commentsByUri,
        isLoading: false,
      };
    },

    [ACTIONS.COMMENT_LIST_STARTED]: state => ({ ...state, isLoading: true }),

    [ACTIONS.COMMENT_LIST_COMPLETED]: (state: CommentsState, action: any) => {
      const { comments, claimId, uri } = action.data;

      const commentById = Object.assign({}, state.commentById);
      const byId = Object.assign({}, state.byId);
      const commentsByUri = Object.assign({}, state.commentsByUri);

      if (comments) {
        // we use an Array to preserve order of listing
        // in reality this doesn't matter and we can just
        // sort comments by their timestamp
        const commentIds = Array(comments.length);

        // map the comment_ids to the new comments
        for (let i = 0; i < comments.length; i++) {
          commentIds[i] = comments[i].comment_id;
          commentById[commentIds[i]] = comments[i];
        }

        byId[claimId] = commentIds;
        commentsByUri[uri] = claimId;
      }
      return {
        ...state,
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
      isLoading: false,
    }),
    // do nothing
    [ACTIONS.COMMENT_UPDATE_STARTED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: true,
    }),
    // replace existing comment with comment returned here under its comment_id
    [ACTIONS.COMMENT_UPDATE_COMPLETED]: (state: CommentsState, action: any) => {
      const { comment } = action.data;
      const commentById = Object.assign({}, state.commentById);
      commentById[comment.comment_id] = comment;

      return {
        ...state,
        commentById,
        isLoading: false,
      };
    },
    // nothing can be done here
    [ACTIONS.COMMENT_UPDATE_FAILED]: (state: CommentsState, action: any) => ({
      ...state,
      isLoading: false,
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
