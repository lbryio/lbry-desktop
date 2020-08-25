import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectMyChannelClaims } from 'lbry-redux';
import { makeSelectRepliesForParentId } from 'redux/selectors/comments';
import { doToast } from 'redux/actions/notifications';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import CommentsReplies from './view';

const select = (state, props) => ({
  myChannels: selectMyChannelClaims(state),
  comments: makeSelectRepliesForParentId(props.parentId)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
});

export default connect(select, {
  doToast,
})(CommentsReplies);
