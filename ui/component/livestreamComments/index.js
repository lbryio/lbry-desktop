import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectMyChannelClaims } from 'redux/selectors/claims';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doCommentList, doSuperChatList } from 'redux/actions/comments';
import {
  selectTopLevelCommentsForUri,
  selectIsFetchingComments,
  makeSelectSuperChatsForUri,
  makeSelectSuperChatTotalAmountForUri,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import LivestreamComments from './view';

const MAX_LIVESTREAM_COMMENTS = 75;

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  comments: selectTopLevelCommentsForUri(state, props.uri, MAX_LIVESTREAM_COMMENTS),
  pinnedComments: selectPinnedCommentsForUri(state, props.uri),
  fetchingComments: selectIsFetchingComments(state),
  superChats: makeSelectSuperChatsForUri(props.uri)(state),
  superChatsTotalAmount: makeSelectSuperChatTotalAmountForUri(props.uri)(state),
  myChannels: selectMyChannelClaims(state),
});

export default connect(select, {
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doCommentList,
  doSuperChatList,
})(LivestreamComments);
