import { connect } from 'react-redux';
import {
  selectThumbnailForUri,
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimsByUri,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { selectOdyseeMembershipForChannelId } from 'redux/selectors/memberships';
import { getChannelIdFromClaim } from 'util/claim';
import ChannelThumbnail from './view';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri);

  return {
    thumbnail: selectThumbnailForUri(state, uri),
    claim,
    isResolving: selectIsUriResolving(state, uri),
    claimsByUri: selectClaimsByUri(state),
    odyseeMembership: selectOdyseeMembershipForChannelId(state, getChannelIdFromClaim(claim)),
  };
};

const perform = {
  doResolveUri,
};

export default connect(select, perform)(ChannelThumbnail);
