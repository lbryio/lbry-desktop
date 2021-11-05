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
import { selectBanStateForUri } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectHasVisitedUri } from 'redux/selectors/content';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import ClaimPreview from './view';
import formatMediaDuration from 'util/formatMediaDuration';
import { selectActiveChannelClaim } from 'redux/selectors/app';

const select = (state, props) => {
  const claim = props.uri && selectClaimForUri(state, props.uri);
  const { claim_id: channelId } = selectActiveChannelClaim(state) || {};
  const media = claim && claim.value && (claim.value.video || claim.value.audio);
  const mediaDuration = media && media.duration && formatMediaDuration(media.duration, { screenReader: true });

  return {
    claim,
    mediaDuration,
    channelId,
    date: props.uri && selectDateForUri(state, props.uri),
    title: props.uri && makeSelectTitleForUri(props.uri)(state),
    pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
    reflectingProgress: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
    obscureNsfw: selectShowMatureContent(state) === false,
    claimIsMine: props.uri && makeSelectClaimIsMine(props.uri)(state),
    isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
    isResolvingRepost: props.uri && makeSelectIsUriResolving(props.repostUrl)(state),
    nsfw: props.uri && makeSelectClaimIsNsfw(props.uri)(state),
    banState: selectBanStateForUri(state, props.uri),
    hasVisitedUri: props.uri && makeSelectHasVisitedUri(props.uri)(state),
    isSubscribed: props.uri && makeSelectIsSubscribed(props.uri, true)(state),
    streamingUrl: props.uri && makeSelectStreamingUrlForUri(props.uri)(state),
    wasPurchased: props.uri && makeSelectClaimWasPurchased(props.uri)(state),
    isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
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
