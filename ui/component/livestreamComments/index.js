import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { doCommentList } from 'redux/actions/comments';
import { makeSelectTopLevelCommentsForUri, selectIsFetchingComments } from 'redux/selectors/comments';
import LivestreamFeed from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  comments: makeSelectTopLevelCommentsForUri(props.uri)(state).slice(0, 25),
  fetchingComments: selectIsFetchingComments(state),
});

export default connect(select, { doCommentSocketConnect, doCommentSocketDisconnect, doCommentList })(LivestreamFeed);
