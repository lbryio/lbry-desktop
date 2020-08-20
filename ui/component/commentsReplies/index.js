import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import { makeSelectRepliesForParentId } from 'redux/selectors/comments';

import CommentsReplies from './view';

const select = (state, props) => ({
  myChannels: selectMyChannelClaims(state),
  comments: makeSelectRepliesForParentId(props.parentId)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

export default connect(select, null)(CommentsReplies);
