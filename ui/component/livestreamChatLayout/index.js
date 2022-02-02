import { connect } from 'react-redux';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { doResolveUris } from 'redux/actions/claims';
import { selectClaimForUri } from 'redux/selectors/claims';
import { doCommentList, doSuperChatList } from 'redux/actions/comments';
import {
  selectTopLevelCommentsForUri,
  selectSuperChatsForUri,
  selectSuperChatTotalAmountForUri,
  selectPinnedCommentsForUri,
} from 'redux/selectors/comments';
import { selectThemePath } from 'redux/selectors/settings';
import LivestreamChatLayout from './view';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    comments: selectTopLevelCommentsForUri(state, uri, MAX_LIVESTREAM_COMMENTS),
    pinnedComments: selectPinnedCommentsForUri(state, uri),
    superChats: selectSuperChatsForUri(state, uri),
    superChatsTotalAmount: selectSuperChatTotalAmountForUri(state, uri),
    theme: selectThemePath(state),
  };
};

export default connect(select, {
  doCommentList,
  doSuperChatList,
  doResolveUris,
})(LivestreamChatLayout);
