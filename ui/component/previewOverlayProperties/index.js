import { connect } from 'react-redux';
import { selectClaimIsMine, selectClaimForUri } from 'redux/selectors/claims';
import { makeSelectFilePartlyDownloaded } from 'redux/selectors/file_info';
import { makeSelectEditedCollectionForId } from 'redux/selectors/collections';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import PreviewOverlayProperties from './view';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  const claimId = claim && claim.claim_id;

  return {
    claim,
    editedCollection: makeSelectEditedCollectionForId(claimId)(state),
    downloaded: makeSelectFilePartlyDownloaded(props.uri)(state),
    isSubscribed: selectIsSubscribedForUri(state, props.uri),
    claimIsMine: selectClaimIsMine(state, claim),
  };
};

export default connect(select, null)(PreviewOverlayProperties);
