import { connect } from 'react-redux';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { selectSubscriptionUris } from 'redux/selectors/subscriptions';
import { withRouter } from 'react-router';
import { selectCanonicalUrlForUri } from 'redux/selectors/claims';
import { doResolveUris } from 'redux/actions/claims';
import { selectChannelMentionData } from 'redux/selectors/livestream';
import ChannelMentionSuggestions from './view';

const select = (state, props) => {
  const maxComments = props.isLivestream ? MAX_LIVESTREAM_COMMENTS : -1;
  const data = selectChannelMentionData(state, props.uri, maxComments);

  return {
    commentorUris: data.commentorUris,
    subscriptionUris: selectSubscriptionUris(state),
    unresolvedCommentors: data.unresolvedCommentors,
    unresolvedSubscriptions: data.unresolvedSubscriptions,
    canonicalCreator: selectCanonicalUrlForUri(state, props.creatorUri),
    canonicalCommentors: data.canonicalCommentors,
    canonicalSubscriptions: data.canonicalSubscriptions,
    showMature: selectShowMatureContent(state),
  };
};

export default withRouter(connect(select, { doResolveUris })(ChannelMentionSuggestions));
