import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims, makeSelectClaimForUri, doResolveUris } from 'lbry-redux';
import { selectIsFetchingCommentsByParentId, makeSelectRepliesForParentId } from 'redux/selectors/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import CommentsReplies from './view';

const select = (state, props) => {
  const fetchedReplies = makeSelectRepliesForParentId(props.parentId)(state);
  const resolvedReplies =
    fetchedReplies && fetchedReplies.length > 0
      ? fetchedReplies.filter(({ channel_url }) => makeSelectClaimForUri(channel_url)(state) !== undefined)
      : [];

  return {
    fetchedReplies,
    resolvedReplies,
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    userCanComment: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
    myChannels: selectMyChannelClaims(state),
    isFetchingByParentId: selectIsFetchingCommentsByParentId(state),
  };
};

const perform = (dispatch) => ({ doResolveUris: (uris) => dispatch(doResolveUris(uris, true)) });

export default connect(select, perform)(CommentsReplies);
