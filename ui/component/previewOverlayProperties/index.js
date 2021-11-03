import { connect } from 'react-redux';
import { makeSelectClaimIsMine, makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectFilePartlyDownloaded } from 'redux/selectors/file_info';
import { makeSelectEditedCollectionForId } from 'redux/selectors/collections';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import PreviewOverlayProperties from './view';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const claimId = claim && claim.claim_id;
  return {
    claim,
    editedCollection: makeSelectEditedCollectionForId(claimId)(state),
    downloaded: makeSelectFilePartlyDownloaded(props.uri)(state),
    isSubscribed: makeSelectIsSubscribed(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  };
};

export default connect(select, null)(PreviewOverlayProperties);
