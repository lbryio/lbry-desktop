import { connect } from 'react-redux';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { doResolveUris } from 'redux/actions/claims';
import { selectClaimForUri, selectMyClaimIdsRaw } from 'redux/selectors/claims';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doCommentList, doSuperChatList } from 'redux/actions/comments';
import {
  selectTopLevelCommentsForUri,
  selectIsFetchingComments,
  selectSuperChatsForUri,
  selectSuperChatTotalAmountForUri,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';

import LivestreamComments from './view';

const select = (state, props) => ({
  claim: selectClaimForUri(state, props.uri),
  comments: selectTopLevelCommentsForUri(state, props.uri, MAX_LIVESTREAM_COMMENTS),
  pinnedComments: selectPinnedCommentsForUri(state, props.uri),
  fetchingComments: selectIsFetchingComments(state),
  superChats: selectSuperChatsForUri(state, props.uri),
  superChatsTotalAmount: selectSuperChatTotalAmountForUri(state, props.uri),
  myChannelIds: selectMyClaimIdsRaw(state),
});

export default connect(select, {
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doCommentList,
  doSuperChatList,
  doResolveUris,
})(LivestreamComments);
