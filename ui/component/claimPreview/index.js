import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectIsUriResolving,
  selectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectReflectingClaimForUri,
  makeSelectClaimWasPurchased,
  selectTitleForUri,
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
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { isClaimNsfw } from 'util/claim';
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
    title: props.uri && selectTitleForUri(state, props.uri),
    pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
    reflectingProgress: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
    obscureNsfw: selectShowMatureContent(state) === false,
    claimIsMine: props.uri && selectClaimIsMine(state, claim),
    isResolvingUri: props.uri && selectIsUriResolving(state, props.uri),
    isResolvingRepost: props.uri && selectIsUriResolving(state, props.repostUrl),
    nsfw: claim ? isClaimNsfw(claim) : false,
    banState: selectBanStateForUri(state, props.uri),
    hasVisitedUri: props.uri && makeSelectHasVisitedUri(props.uri)(state),
    isSubscribed: props.uri && selectIsSubscribedForUri(state, props.uri),
    streamingUrl: props.uri && makeSelectStreamingUrlForUri(props.uri)(state),
    wasPurchased: props.uri && makeSelectClaimWasPurchased(props.uri)(state),
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
