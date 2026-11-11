//@ts-nocheck
import { connect } from "react-redux";
import { doResolveUris } from "redux/actions/claims";
import { selectClaimIsMineForUri, makeSelectClaimForUri } from "redux/selectors/claims";
import { selectIsFetchingCommentsByParentId, selectRepliesForParentId } from "redux/selectors/comments";
import CommentsReplies from "./view";

const select = (state: unknown, props: unknown) => {
  const fetchedReplies = selectRepliesForParentId(state, props.parentId);
  const resolvedReplies =
    fetchedReplies && fetchedReplies.length > 0
      ? fetchedReplies.filter(({ channel_url }) => makeSelectClaimForUri(channel_url)(state) !== undefined)
      : [];

  return {
    fetchedReplies,
    resolvedReplies,
    claimIsMine: selectClaimIsMineForUri(state, props.uri),
    userCanComment: true,
    isFetchingByParentId: selectIsFetchingCommentsByParentId(state),
  };
};

const perform = (dispatch: unknown) => ({ doResolveUris: (uris) => dispatch(doResolveUris(uris, true)) });

export default connect(select, perform)(CommentsReplies);
