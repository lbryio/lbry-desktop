import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doCommentList, doSuperChatList } from 'redux/actions/comments';
import {
  makeSelectTopLevelCommentsForUri,
  selectIsFetchingComments,
  makeSelectSuperChatsForUri,
  makeSelectSuperChatTotalAmountForUri,
} from 'redux/selectors/comments';
import LivestreamFeed from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  comments: makeSelectTopLevelCommentsForUri(props.uri)(state).slice(0, 75),
  fetchingComments: selectIsFetchingComments(state),
  superChats: makeSelectSuperChatsForUri(props.uri)(state),
  superChatsTotalAmount: makeSelectSuperChatTotalAmountForUri(props.uri)(state),
});

export default connect(select, {
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doCommentList,
  doSuperChatList,
})(LivestreamFeed);
