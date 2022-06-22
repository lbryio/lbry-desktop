import { connect } from 'react-redux';
import {
  makeSelectReactionsForUri,
  makeSelectMyReactionForUri,
  makeSelectLikeCountForUri,
  makeSelectDislikeCountForUri,
} from 'redux/selectors/reactions';
import { doFetchReactions, doReactionLike, doReactionDislike } from 'redux/actions/reactions';
import { selectThemePath } from 'redux/selectors/settings';
import FileViewCount from './view';
import { makeSelectClaimForUri } from 'redux/selectors/claims';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  reactions: makeSelectReactionsForUri(props.uri)(state),
  myReaction: makeSelectMyReactionForUri(props.uri)(state),
  likeCount: makeSelectLikeCountForUri(props.uri)(state),
  dislikeCount: makeSelectDislikeCountForUri(props.uri)(state),
  theme: selectThemePath(state),
});

export default connect(select, {
  doFetchReactions,
  doReactionLike,
  doReactionDislike,
})(FileViewCount);
