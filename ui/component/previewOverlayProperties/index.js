import { connect } from 'react-redux';
import {
  makeSelectFilePartlyDownloaded,
  makeSelectClaimIsMine,
  makeSelectClaimForUri,
  makeSelectEditedCollectionForId,
} from 'lbry-redux';
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
