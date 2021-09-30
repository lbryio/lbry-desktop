import { connect } from 'react-redux';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { withRouter } from 'react-router';
import { doResolveUris, makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectTopLevelCommentsForUri } from 'redux/selectors/comments';
import ChannelMentionSuggestions from './view';

const select = (state, props) => {
  const subscriptionUris = selectSubscriptions(state).map(({ uri }) => uri);
  const topLevelComments = makeSelectTopLevelCommentsForUri(props.uri)(state);

  let commentorUris = [];
  topLevelComments.map(({ channel_url }) => !commentorUris.includes(channel_url) && commentorUris.push(channel_url));

  const getUnresolved = (uris) =>
    uris.map((uri) => !makeSelectClaimForUri(uri)(state) && uri).filter((uri) => uri !== false);

  return {
    commentorUris,
    subscriptionUris,
    unresolvedCommentors: getUnresolved(commentorUris),
    unresolvedSubscriptions: getUnresolved(subscriptionUris),
    showMature: selectShowMatureContent(state),
  };
};

export default withRouter(connect(select, { doResolveUris })(ChannelMentionSuggestions));
