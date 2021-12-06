import { connect } from 'react-redux';
import { doResolveUris } from 'redux/actions/claims';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { selectChannelMentionData } from 'redux/selectors/comments';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { withRouter } from 'react-router';
import TextareaWithSuggestions from './view';

const select = (state, props) => {
  const { pathname } = props.location;
  const maxComments = props.isLivestream ? MAX_LIVESTREAM_COMMENTS : -1;
  const uri = `lbry:/${pathname.replaceAll(':', '#')}`;

  const data = selectChannelMentionData(state, uri, maxComments);
  const { canonicalCommentors, canonicalCreatorUri, canonicalSubscriptions, commentorUris } = data;

  return {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSubscriptions,
    commentorUris,
    showMature: selectShowMatureContent(state),
  };
};

const perform = (dispatch) => ({
  doResolveUris: (uris) => dispatch(doResolveUris(uris, true)),
});

export default withRouter(connect(select, perform)(TextareaWithSuggestions));
