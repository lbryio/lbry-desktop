import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  selectIsUriResolving,
  selectTitleForUri,
  selectDateForUri,
  selectGeoRestrictionForUri,
  selectClaimIsMine,
} from 'redux/selectors/claims';
import { doFileGetForUri } from 'redux/actions/file';
import { doResolveUri } from 'redux/actions/claims';
import { selectViewCountForUri, selectBanStateForUri } from 'lbryinc';
import { selectStreamingUrlForUri } from 'redux/selectors/file_info';
import { selectIsActiveLivestreamForUri, selectViewersForId } from 'redux/selectors/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { isClaimNsfw, isStreamPlaceholderClaim } from 'util/claim';
import ClaimPreviewTile from './view';
import formatMediaDuration from 'util/formatMediaDuration';

const select = (state, props) => {
  const claim = props.uri && makeSelectClaimForUri(props.uri)(state);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });
  const isLivestream = isStreamPlaceholderClaim(claim);
  const repostSrcUri = claim && claim.repost_url && claim.canonical_url;

  return {
    claim,
    mediaDuration,
    date: props.uri && selectDateForUri(state, props.uri),
    isResolvingUri: props.uri && selectIsUriResolving(state, props.uri),
    claimIsMine: props.uri && selectClaimIsMine(state, claim),
    title: props.uri && selectTitleForUri(state, props.uri),
    banState: selectBanStateForUri(state, props.uri),
    geoRestriction: selectGeoRestrictionForUri(state, props.uri),
    streamingUrl: (repostSrcUri || props.uri) && selectStreamingUrlForUri(state, repostSrcUri || props.uri),
    showMature: selectShowMatureContent(state),
    isMature: claim ? isClaimNsfw(claim) : false,
    isLivestream,
    isLivestreamActive: isLivestream && selectIsActiveLivestreamForUri(state, props.uri),
    livestreamViewerCount: isLivestream && claim ? selectViewersForId(state, claim.claim_id) : undefined,
    viewCount: selectViewCountForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGetForUri(uri)),
});

export default connect(select, perform)(ClaimPreviewTile);
