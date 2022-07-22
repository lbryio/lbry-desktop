import { connect } from 'react-redux';
import { selectClaimForUri, makeSelectTagInClaimOrChannelForUri, selectThumbnailForUri } from 'redux/selectors/claims';
import { selectHyperChatsForUri } from 'redux/selectors/comments';
import LivestreamLayout from './view';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import { selectViewersForId } from 'redux/selectors/livestream';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;

  return {
    claim,
    thumbnail: selectThumbnailForUri(state, uri),
    chatDisabled: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_COMMENTS_TAG)(state),
    superChats: selectHyperChatsForUri(state, uri),
    activeViewers: claimId && selectViewersForId(state, claimId),
  };
};

export default connect(select)(LivestreamLayout);
