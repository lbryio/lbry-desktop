import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectThumbnailForUri,
  makeSelectTitleForUri,
  doFileGet,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
  makeSelectClaimIsStreamPlaceholder,
} from 'lbry-redux';
import { selectMutedChannels } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import ClaimPreviewTile from './view';

const select = (state, props) => ({
  claim: props.uri && makeSelectClaimForUri(props.uri)(state),
  channel: props.uri && makeSelectChannelForClaimUri(props.uri)(state),
  isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
  thumbnail: props.uri && makeSelectThumbnailForUri(props.uri)(state),
  title: props.uri && makeSelectTitleForUri(props.uri)(state),
  blackListedOutpoints: selectBlackListedOutpoints(state),
  filteredOutpoints: selectFilteredOutpoints(state),
  blockedChannelUris: selectMutedChannels(state),
  showMature: selectShowMatureContent(state),
  isMature: makeSelectClaimIsNsfw(props.uri)(state),
  isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
});

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
});

export default connect(select, perform)(ClaimPreviewTile);
