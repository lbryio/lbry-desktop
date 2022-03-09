import { connect } from 'react-redux';
import {
  selectThumbnailForUri,
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimsByUri,
  selectOdyseeMembershipForUri,
} from 'redux/selectors/claims';
import { doResolveUri } from 'redux/actions/claims';
import { doFetchUserMemberships } from 'redux/actions/user';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: selectThumbnailForUri(state, props.uri),
  claim: selectClaimForUri(state, props.uri),
  isResolving: selectIsUriResolving(state, props.uri),
  odyseeMembership: selectOdyseeMembershipForUri(state, props.uri),
  claimsByUri: selectClaimsByUri(state),
});

export default connect(select, {
  doResolveUri,
  doFetchUserMemberships,
})(ChannelThumbnail);
