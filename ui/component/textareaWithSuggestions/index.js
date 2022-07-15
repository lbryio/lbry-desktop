import { connect } from 'react-redux';
import { doResolveUris } from 'redux/actions/claims';
import { doSetMentionSearchResults } from 'redux/actions/search';
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import { MAX_LIVESTREAM_COMMENTS } from 'constants/livestream';
import { selectChannelMentionData } from 'redux/selectors/comments';
import { withRouter } from 'react-router';
import TextareaWithSuggestions from './view';

const select = (state, props) => {
  const { uri } = props;

  const maxComments = props.isLivestream ? MAX_LIVESTREAM_COMMENTS : -1;
  const data = selectChannelMentionData(state, uri, maxComments);
  const {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSearch,
    canonicalSubscriptions,
    commentorUris,
    hasNewResolvedResults,
    query,
  } = data;

  return {
    canonicalCommentors,
    canonicalCreatorUri,
    canonicalSearch,
    canonicalSubscriptions,
    canonicalTop: makeSelectWinningUriForQuery(query)(state),
    commentorUris,
    hasNewResolvedResults,
    searchQuery: query,
  };
};

const perform = {
  doResolveUris,
  doSetMentionSearchResults,
};

export default withRouter(connect(select, perform)(TextareaWithSuggestions));
