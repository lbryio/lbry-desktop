import { connect } from 'react-redux';
import { makeSelectClaimIsMine, selectFetchingMyChannels, selectMyChannelClaims } from 'lbry-redux';
import {
  makeSelectTopLevelCommentsForUri,
  selectIsFetchingComments,
  makeSelectTotalCommentsCountForUri,
} from 'redux/selectors/comments';
import { doCommentList, doCommentReactList } from 'redux/actions/comments';
import CommentsList from './view';
import { selectUserVerifiedEmail } from 'redux/selectors/user';

const select = (state, props) => ({
  myChannels: selectMyChannelClaims(state),
  comments: makeSelectTopLevelCommentsForUri(props.uri)(state),
  totalComments: makeSelectTotalCommentsCountForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  isFetchingComments: selectIsFetchingComments(state),
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  fetchingChannels: selectFetchingMyChannels(state),
});

const perform = dispatch => ({
  fetchComments: uri => dispatch(doCommentList(uri)),
  fetchReacts: uri => dispatch(doCommentReactList(uri)),
});

export default connect(select, perform)(CommentsList);
