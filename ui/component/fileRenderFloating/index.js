import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectTitleForUri,
  selectClaimWasPurchasedForUri,
  selectGeoRestrictionForUri,
  selectClaimIsNsfwForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import {
  selectCollectionForId,
  selectNextUrlForCollectionAndUrl,
  selectPreviousUrlForCollectionAndUrl,
  selectCollectionForIdHasClaimUrl,
  selectFirstItemUrlForCollection,
} from 'redux/selectors/collections';
import * as SETTINGS from 'constants/settings';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import {
  makeSelectIsPlayerFloating,
  selectPrimaryUri,
  selectPlayingUri,
  makeSelectFileRenderModeForUri,
} from 'redux/selectors/content';
import { selectClientSetting } from 'redux/selectors/settings';
import { doClearQueueList } from 'redux/actions/collections';
import { selectCostInfoForUri } from 'lbryinc';
import { doUriInitiatePlay, doClearPlayingUri, doClearPlayingSource } from 'redux/actions/content';
import { doFetchRecommendedContent } from 'redux/actions/search';
import { withRouter } from 'react-router';
import { selectHasAppDrawerOpen, selectMainPlayerDimensions } from 'redux/selectors/app';
import { selectIsActiveLivestreamForUri, selectSocketConnectionForId } from 'redux/selectors/livestream';
import { doCommentSocketConnect, doCommentSocketDisconnect } from 'redux/actions/websocket';
import { isStreamPlaceholderClaim, getVideoClaimAspectRatio } from 'util/claim';
import { doOpenModal } from 'redux/actions/app';
import FileRenderFloating from './view';

const select = (state, props) => {
  const { location } = props;
  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const collectionSidebarId = urlParams.get(COLLECTIONS_CONSTS.COLLECTION_ID);

  const isFloating = makeSelectIsPlayerFloating(location)(state);

  const playingUri = selectPlayingUri(state);
  const {
    uri,
    collection: { collectionId },
  } = playingUri;

  const claim = uri && selectClaimForUri(state, uri);
  const { claim_id: claimId, signing_channel: channelClaim, permanent_url } = claim || {};
  const { canonical_url: channelUrl } = channelClaim || {};
  const playingFromQueue = playingUri.source === COLLECTIONS_CONSTS.QUEUE_ID;
  const isInlinePlayer = Boolean(playingUri.source) && !isFloating;

  return {
    claimId,
    channelUrl,
    uri,
    playingUri,
    primaryUri: selectPrimaryUri(state),
    title: selectTitleForUri(state, uri),
    isFloating,
    streamingUrl: makeSelectStreamingUrlForUri(uri)(state),
    floatingPlayerEnabled: playingFromQueue || isInlinePlayer || selectClientSetting(state, SETTINGS.FLOATING_PLAYER),
    renderMode: makeSelectFileRenderModeForUri(uri)(state),
    videoTheaterMode: selectClientSetting(state, SETTINGS.VIDEO_THEATER_MODE),
    costInfo: selectCostInfoForUri(state, uri),
    claimWasPurchased: selectClaimWasPurchasedForUri(state, uri),
    nextListUri: collectionId && selectNextUrlForCollectionAndUrl(state, uri, collectionId),
    previousListUri: collectionId && selectPreviousUrlForCollectionAndUrl(state, uri, collectionId),
    collectionId,
    collectionSidebarId,
    playingCollection: selectCollectionForId(state, collectionId),
    isCurrentClaimLive: selectIsActiveLivestreamForUri(state, uri),
    videoAspectRatio: getVideoClaimAspectRatio(claim),
    socketConnection: selectSocketConnectionForId(state, claimId),
    isLivestreamClaim: isStreamPlaceholderClaim(claim),
    geoRestriction: selectGeoRestrictionForUri(state, uri),
    appDrawerOpen: selectHasAppDrawerOpen(state),
    hasClaimInQueue:
      permanent_url && selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, permanent_url),
    mainPlayerDimensions: selectMainPlayerDimensions(state),
    firstCollectionItemUrl: selectFirstItemUrlForCollection(state, collectionId),
    isMature: selectClaimIsNsfwForUri(state, uri),
  };
};

const perform = {
  doFetchRecommendedContent,
  doUriInitiatePlay,
  doCommentSocketConnect,
  doCommentSocketDisconnect,
  doClearPlayingUri,
  doClearQueueList,
  doOpenModal,
  doClearPlayingSource,
};

export default withRouter(connect(select, perform)(FileRenderFloating));
