import { connect } from 'react-redux';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectSubscriptionUris } from 'redux/selectors/subscriptions';
import { withRouter } from 'react-router';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { doResolveUris } from 'redux/actions/claims';
import { selectTopLevelCommentsForUri } from 'redux/selectors/comments';
import ChannelMentionSuggestions from './view';

const select = (state, props) => {
  const subscriptionUris = selectSubscriptionUris(state);
  const topLevelComments = selectTopLevelCommentsForUri(
    state,
    props.uri,
    props.isLivestream ? MAX_LIVESTREAM_COMMENTS : -1
  );

  const commentorUris = [];
  // Avoid repeated commentors
  topLevelComments.map(({ channel_url }) => !commentorUris.includes(channel_url) && commentorUris.push(channel_url));

  const getUnresolved = (uris) =>
    uris.map((uri) => !makeSelectClaimForUri(uri)(state) && uri).filter((uri) => uri !== false);
  const getCanonical = (uris) =>
    uris
      .map((uri) => makeSelectClaimForUri(uri)(state) && makeSelectClaimForUri(uri)(state).canonical_url)
      .filter((uri) => Boolean(uri));

  return {
    commentorUris,
    subscriptionUris,
    unresolvedCommentors: getUnresolved(commentorUris),
    unresolvedSubscriptions: getUnresolved(subscriptionUris),
    canonicalCreator: getCanonical([props.creatorUri])[0],
    canonicalCommentors: getCanonical(commentorUris),
    canonicalSubscriptions: getCanonical(subscriptionUris),
    showMature: selectShowMatureContent(state),
  };
};

export default withRouter(connect(select, { doResolveUris })(ChannelMentionSuggestions));
