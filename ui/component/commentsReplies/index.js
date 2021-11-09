import { connect } from 'react-redux';
import { doResolveUris } from 'redux/actions/claims';
import { makeSelectClaimIsMine, selectMyChannelClaims, makeSelectClaimForUri } from 'redux/selectors/claims';
import { selectIsFetchingCommentsByParentId, selectRepliesForParentId } from 'redux/selectors/comments';
import CommentsReplies from './view';

const select = (state, props) => {
  const fetchedReplies = selectRepliesForParentId(state, props.parentId);
  const resolvedReplies =
    fetchedReplies && fetchedReplies.length > 0
      ? fetchedReplies.filter(({ channel_url }) => makeSelectClaimForUri(channel_url)(state) !== undefined)
      : [];

  return {
    fetchedReplies,
    resolvedReplies,
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    userCanComment: true,
    myChannels: selectMyChannelClaims(state),
    isFetchingByParentId: selectIsFetchingCommentsByParentId(state),
  };
};

const perform = (dispatch) => ({ doResolveUris: (uris) => dispatch(doResolveUris(uris, true)) });

export default connect(select, perform)(CommentsReplies);
