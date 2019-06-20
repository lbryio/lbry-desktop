import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  makeSelectClaimIsNsfw,
} from 'lbry-redux';
import { selectShowNsfw } from 'redux/selectors/settings';
import ClaimListItem from './view';

const select = (state, props) => ({
  pending: makeSelectClaimIsPending(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  nsfw: makeSelectClaimIsNsfw(props.uri)(state),
});

const perform = dispatch => ({
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(
  select,
  perform
)(ClaimListItem);
