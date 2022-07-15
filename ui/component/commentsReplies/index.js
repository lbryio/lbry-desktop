import { connect } from 'react-redux';
import { selectClaimIsMineForUri } from 'redux/selectors/claims';
import { selectIsFetchingCommentsForParentId, selectRepliesForParentId } from 'redux/selectors/comments';
import CommentsReplies from './view';

const select = (state, props) => {
  const { uri, parentId } = props;

  return {
    fetchedReplies: selectRepliesForParentId(state, parentId),
    claimIsMine: selectClaimIsMineForUri(state, uri),
    isFetching: selectIsFetchingCommentsForParentId(state, parentId),
  };
};

export default connect(select)(CommentsReplies);
