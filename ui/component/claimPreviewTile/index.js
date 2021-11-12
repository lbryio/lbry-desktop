import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  getThumbnailFromClaim,
  makeSelectTitleForUri,
  makeSelectChannelForClaimUri,
  makeSelectClaimIsNsfw,
  makeSelectClaimIsStreamPlaceholder,
  selectDateForUri,
} from 'redux/selectors/claims';
import { doFileGet } from 'redux/actions/file';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectViewCountForUri, selectBanStateForUri } from 'lbryinc';
import { makeSelectIsActiveLivestream } from 'redux/selectors/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import ClaimPreviewTile from './view';
import formatMediaDuration from 'util/formatMediaDuration';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });

  return {
    claim,
    mediaDuration,
    date: props.uri && selectDateForUri(state, props.uri),
    channel: props.uri && makeSelectChannelForClaimUri(props.uri)(state),
    isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
    thumbnail: getThumbnailFromClaim(claim),
    title: props.uri && makeSelectTitleForUri(props.uri)(state),
    banState: selectBanStateForUri(state, props.uri),
    showMature: selectShowMatureContent(state),
    isMature: makeSelectClaimIsNsfw(props.uri)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
    isLivestreamActive: makeSelectIsActiveLivestream(props.uri)(state),
    viewCount: makeSelectViewCountForUri(props.uri)(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
});

export default connect(select, perform)(ClaimPreviewTile);
