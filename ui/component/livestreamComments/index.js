import { connect } from 'react-redux';
import { makeSelectClaimForUri, selectMyChannelClaims } from 'lbry-redux';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doCommentList, doSuperChatList } from 'redux/actions/comments';
import {
  selectPinnedCommentsById,
  makeSelectTopLevelCommentsForUri,
  selectIsFetchingComments,
  makeSelectSuperChatsForUri,
  makeSelectSuperChatTotalAmountForUri,
} from 'redux/selectors/comments';
import LivestreamComments from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  comments: makeSelectTopLevelCommentsForUri(props.uri)(state).slice(0, 75),
  fetchingComments: selectIsFetchingComments(state),
  superChats: makeSelectSuperChatsForUri(props.uri)(state),
  superChatsTotalAmount: makeSelectSuperChatTotalAmountForUri(props.uri)(state),
  myChannels: selectMyChannelClaims(state),
  pinnedCommentsById: selectPinnedCommentsById(state),
});

export default connect(select, {
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doCommentList,
  doSuperChatList,
})(LivestreamComments);
