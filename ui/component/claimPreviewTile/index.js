import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  selectIsUriResolving,
  getThumbnailFromClaim,
  selectTitleForUri,
  selectDateForUri,
} from 'redux/selectors/claims';
import { doFileGet } from 'redux/actions/file';
import { doResolveUri } from 'redux/actions/claims';
import { selectViewCountForUri, selectBanStateForUri } from 'lbryinc';
import { selectIsActiveLivestreamForUri } from 'redux/selectors/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { isClaimNsfw, isStreamPlaceholderClaim } from 'util/claim';
import ClaimPreviewTile from './view';
import formatMediaDuration from 'util/formatMediaDuration';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });
  const isLivestream = isStreamPlaceholderClaim(claim);

  return {
    claim,
    mediaDuration,
    date: props.uri && selectDateForUri(state, props.uri),
    isResolvingUri: props.uri && selectIsUriResolving(state, props.uri),
    thumbnail: getThumbnailFromClaim(claim),
    title: props.uri && selectTitleForUri(state, props.uri),
    banState: selectBanStateForUri(state, props.uri),
    showMature: selectShowMatureContent(state),
    isMature: claim ? isClaimNsfw(claim) : false,
    isLivestream,
    isLivestreamActive: isLivestream && selectIsActiveLivestreamForUri(state, props.uri),
    viewCount: selectViewCountForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
});

export default connect(select, perform)(ClaimPreviewTile);
