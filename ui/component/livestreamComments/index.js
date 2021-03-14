import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doCommentSocketConnect } from 'redux/actions/websocket';
import { doCommentList } from 'redux/actions/comments';
import { makeSelectTopLevelCommentsForUri, selectIsFetchingComments } from 'redux/selectors/comments';
import LivestreamFeed from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  comments: makeSelectTopLevelCommentsForUri(props.uri)(state),
  fetchingComments: selectIsFetchingComments(state),
});

export default connect(select, { doCommentSocketConnect, doCommentList })(LivestreamFeed);
