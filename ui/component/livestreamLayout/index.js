import { connect } from 'react-redux';
import { selectClaimForUri, selectThumbnailForUri } from 'redux/selectors/claims';
import { selectHyperChatsForUri, selectCommentsDisabledSettingForChannelId } from 'redux/selectors/comments';
import LivestreamLayout from './view';
import { selectViewersForId } from 'redux/selectors/livestream';
import { getChannelIdFromClaim } from 'util/claim';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);
  const claimId = claim && claim.claim_id;

  return {
    claim,
    thumbnail: selectThumbnailForUri(state, uri),
    chatDisabled: selectCommentsDisabledSettingForChannelId(uri, getChannelIdFromClaim(claim)),
    superChats: selectHyperChatsForUri(state, uri),
    activeViewers: claimId && selectViewersForId(state, claimId),
  };
};

export default connect(select)(LivestreamLayout);
