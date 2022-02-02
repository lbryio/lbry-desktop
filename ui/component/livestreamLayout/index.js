import { connect } from 'react-redux';
import { selectClaimForUri, makeSelectTagInClaimOrChannelForUri, selectThumbnailForUri } from 'redux/selectors/claims';
import { selectSuperChatsForUri } from 'redux/selectors/comments';
import LivestreamLayout from './view';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    thumbnail: selectThumbnailForUri(state, uri),
    chatDisabled: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_COMMENTS_TAG)(state),
    superChats: selectSuperChatsForUri(state, uri),
  };
};

export default connect(select)(LivestreamLayout);
