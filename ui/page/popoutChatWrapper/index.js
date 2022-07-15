import { buildURI } from 'util/lbryURI';
import { connect } from 'react-redux';
import { doCommentSocketConnectAsCommenter, doCommentSocketDisconnectAsCommenter } from 'redux/actions/websocket';
import { doResolveUri } from 'redux/actions/claims';
import { selectClaimForUri } from 'redux/selectors/claims';
import PopoutChatPage from './view';

const select = (state, props) => {
  const { match } = props;
  const { params } = match;
  const { channelName, streamName } = params;

  const uri = buildURI({ channelName: channelName.replace(':', '#'), streamName: streamName.replace(':', '#') }) || '';

  return {
    claim: selectClaimForUri(state, uri),
    uri,
  };
};

const perform = {
  doCommentSocketConnectAsCommenter,
  doCommentSocketDisconnectAsCommenter,
  doResolveUri,
};

export default connect(select, perform)(PopoutChatPage);
