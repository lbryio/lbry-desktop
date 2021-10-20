import { connect } from 'react-redux';
import {
  selectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectClaimIsNsfw,
  makeSelectReflectingClaimForUri,
  makeSelectClaimWasPurchased,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectTitleForUri,
  selectDateForUri,
} from 'redux/selectors/claims';
import { makeSelectStreamingUrlForUri } from 'redux/selectors/file_info';
import {
  makeSelectCollectionIsMine,
  makeSelectUrlsForCollectionId,
  makeSelectIndexForUrlInCollection,
} from 'redux/selectors/collections';

import { doResolveUri } from 'redux/actions/claims';
import { doCollectionEdit } from 'redux/actions/collections';
import { doFileGet } from 'redux/actions/file';
import { selectMutedChannels, makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { makeSelectIsActiveLivestream } from 'redux/selectors/livestream';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectHasVisitedUri } from 'redux/selectors/content';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import ClaimPreview from './view';
import formatMediaDuration from 'util/formatMediaDuration';

const select = (state, props) => {
  const claim = props.uri && selectClaimForUri(state, props.uri);
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });

  return {
    claim,
    mediaDuration,
    date: props.uri && selectDateForUri(state, props.uri),
    title: props.uri && makeSelectTitleForUri(props.uri)(state),
    pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
    reflectingProgress: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
    obscureNsfw: selectShowMatureContent(state) === false,
    claimIsMine: props.uri && makeSelectClaimIsMine(props.uri)(state),
    isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
    isResolvingRepost: props.uri && makeSelectIsUriResolving(props.repostUrl)(state),
    nsfw: props.uri && makeSelectClaimIsNsfw(props.uri)(state),
    blackListedOutpoints: selectBlackListedOutpoints(state),
    filteredOutpoints: selectFilteredOutpoints(state),
    mutedUris: selectMutedChannels(state),
    blockedUris: selectModerationBlockList(state),
    hasVisitedUri: props.uri && makeSelectHasVisitedUri(props.uri)(state),
    channelIsBlocked: props.uri && makeSelectChannelIsMuted(props.uri)(state),
    isSubscribed: props.uri && makeSelectIsSubscribed(props.uri, true)(state),
    streamingUrl: props.uri && makeSelectStreamingUrlForUri(props.uri)(state),
    wasPurchased: props.uri && makeSelectClaimWasPurchased(props.uri)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
    isLivestreamActive: makeSelectIsActiveLivestream(props.uri)(state),
    isCollectionMine: makeSelectCollectionIsMine(props.collectionId)(state),
    collectionUris: makeSelectUrlsForCollectionId(props.collectionId)(state),
    collectionIndex: makeSelectIndexForUrlInCollection(props.uri, props.collectionId)(state),
  };
};

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
  editCollection: (id, params) => dispatch(doCollectionEdit(id, params)),
});

export default connect(select, perform)(ClaimPreview);
