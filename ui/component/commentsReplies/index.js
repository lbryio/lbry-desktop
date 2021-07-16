import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import {
  selectIsFetchingCommentsByParentId,
  makeSelectRepliesForParentId,
  makeSelectTotalRepliesForParentId,
} from 'redux/selectors/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import CommentsReplies from './view';

const select = (state, props) => ({
  fetchedReplies: makeSelectRepliesForParentId(props.parentId)(state),
  totalReplies: makeSelectTotalRepliesForParentId(props.parentId)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  myChannels: selectMyChannelClaims(state),
  isFetchingByParentId: selectIsFetchingCommentsByParentId(state),
});

export default connect(select)(CommentsReplies);
