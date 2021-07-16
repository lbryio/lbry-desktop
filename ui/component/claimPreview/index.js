import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
  makeSelectClaimIsMine,
  makeSelectClaimIsPending,
  makeSelectClaimIsNsfw,
  doFileGet,
  makeSelectReflectingClaimForUri,
  makeSelectClaimWasPurchased,
  makeSelectStreamingUrlForUri,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectCollectionIsMine,
  doCollectionEdit,
  makeSelectUrlsForCollectionId,
  makeSelectIndexForUrlInCollection,
} from 'lbry-redux';
import { selectMutedChannels, makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { selectBlackListedOutpoints, selectFilteredOutpoints } from 'lbryinc';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { makeSelectHasVisitedUri } from 'redux/selectors/content';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { selectModerationBlockList } from 'redux/selectors/comments';
import ClaimPreview from './view';

const select = (state, props) => ({
  pending: props.uri && makeSelectClaimIsPending(props.uri)(state),
  claim: props.uri && makeSelectClaimForUri(props.uri)(state),
  reflectingProgress: props.uri && makeSelectReflectingClaimForUri(props.uri)(state),
  obscureNsfw: selectShowMatureContent(state) === false,
  claimIsMine: props.uri && makeSelectClaimIsMine(props.uri)(state),
  isResolvingUri: props.uri && makeSelectIsUriResolving(props.uri)(state),
  isResolvingRepost: props.uri && makeSelectIsUriResolving(props.repostUrl)(state),
  repostClaim: props.uri && makeSelectClaimForUri(props.uri)(state),
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
  isCollectionMine: makeSelectCollectionIsMine(props.collectionId)(state),
  collectionUris: makeSelectUrlsForCollectionId(props.collectionId)(state),
  collectionIndex: makeSelectIndexForUrlInCollection(props.uri, props.collectionId)(state),
});

const perform = (dispatch) => ({
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  getFile: (uri) => dispatch(doFileGet(uri, false)),
  editCollection: (id, params) => dispatch(doCollectionEdit(id, params)),
});

export default connect(select, perform)(ClaimPreview);
