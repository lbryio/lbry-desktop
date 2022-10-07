import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectReflectingClaimForUri,
  selectTitleForUri,
  selectDateForUri,
  selectGeoRestrictionForUri,
} from 'redux/selectors/claims';
import { selectStreamingUrlForUri } from 'redux/selectors/file_info';
import { selectCollectionIsMine } from 'redux/selectors/collections';

import { doResolveUri } from 'redux/actions/claims';
import { doFileGetForUri } from 'redux/actions/file';
import { selectBanStateForUri } from 'lbryinc';
import { selectIsActiveLivestreamForUri, selectViewersForId } from 'redux/selectors/livestream';
import { selectLanguage, selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectHasVisitedUri } from 'redux/selectors/content';
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { isClaimNsfw, isStreamPlaceholderClaim } from 'util/claim';
import ClaimPreview from './view';
import formatMediaDuration from 'util/formatMediaDuration';
import { doClearContentHistoryUri, doUriInitiatePlay } from 'redux/actions/content';

const select = (state, props) => {
  const claim = props.uri && selectClaimForUri(state, props.uri);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });
  const isLivestream = isStreamPlaceholderClaim(claim);
  const repostSrcUri = claim && claim.repost_url && claim.canonical_url;

  return {
    banState: selectBanStateForUri(state, props.uri),
    claim,
    claimIsMine: props.uri && selectClaimIsMine(state, claim),
    date: props.uri && selectDateForUri(state, props.uri),
    geoRestriction: selectGeoRestrictionForUri(state, props.uri),
    hasVisitedUri: props.uri && makeSelectHasVisitedUri(props.uri)(state),
    isCollectionMine: selectCollectionIsMine(state, props.collectionId),
    isLivestream,
    isLivestreamActive: isLivestream && selectIsActiveLivestreamForUri(state, props.uri),
    isResolvingRepost: props.uri && selectIsUriResolving(state, props.repostUrl),
    isResolvingUri: props.uri && selectIsUriResolving(state, props.uri),
    isSubscribed: props.uri && selectIsSubscribedForUri(state, props.uri),
    lang: selectLanguage(state),
    livestreamViewerCount: isLivestream && claim ? selectViewersForId(state, claim.claim_id) : undefined,
    mediaDuration,
    nsfw: claim ? isClaimNsfw(claim) : false,
    obscureNsfw: selectShowMatureContent(state) === false,
    pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
    reflectingProgress: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
    streamingUrl: (repostSrcUri || props.uri) && selectStreamingUrlForUri(state, repostSrcUri || props.uri),
    title: props.uri && selectTitleForUri(state, props.uri),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGetForUri(uri)),
  doClearContentHistoryUri: (uri) => dispatch(doClearContentHistoryUri(uri)),
  doUriInitiatePlay: (playingOptions, isPlayable, isFloating) =>
    dispatch(doUriInitiatePlay(playingOptions, isPlayable, isFloating)),
});

export default connect(select, perform)(ClaimPreview);
