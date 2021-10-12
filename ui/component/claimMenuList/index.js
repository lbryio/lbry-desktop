import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsMine } from 'redux/selectors/claims';
import { doCollectionEdit, doFetchItemsInCollection } from 'redux/actions/collections';
import { doPrepareEdit } from 'redux/actions/publish';
import {
  makeSelectCollectionForIdHasClaimUrl,
  makeSelectCollectionIsMine,
  makeSelectEditedCollectionForId,
  makeSelectUrlsForCollectionId,
} from 'redux/selectors/collections';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doChannelMute, doChannelUnmute } from 'redux/actions/blocked';
import { doSetActiveChannel, doSetIncognito, doOpenModal } from 'redux/actions/app';
import {
  doCommentModBlock,
  doCommentModUnBlock,
  doCommentModBlockAsAdmin,
  doCommentModUnBlockAsAdmin,
} from 'redux/actions/comments';
import {
  selectHasAdminChannel,
  makeSelectChannelIsBlocked,
  makeSelectChannelIsAdminBlocked,
} from 'redux/selectors/comments';
import { doToast } from 'redux/actions/notifications';
import { doChannelSubscribe, doChannelUnsubscribe } from 'redux/actions/subscriptions';
import { makeSelectIsSubscribed } from 'redux/selectors/subscriptions';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectListShuffle } from 'redux/selectors/content';
import { doToggleLoopList, doToggleShuffleList } from 'redux/actions/content';
import ClaimPreview from './view';
import fs from 'fs';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri, false)(state);
  const collectionId = props.collectionId;
  const repostedClaim = claim && claim.reposted_claim;
  const contentClaim = repostedClaim || claim;
  const contentSigningChannel = contentClaim && contentClaim.signing_channel;
  const contentPermanentUri = contentClaim && contentClaim.permanent_url;
  const contentChannelUri = (contentSigningChannel && contentSigningChannel.permanent_url) || contentPermanentUri;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];

  return {
    claim,
    repostedClaim,
    contentClaim,
    contentSigningChannel,
    contentChannelUri,
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    hasClaimInWatchLater: makeSelectCollectionForIdHasClaimUrl(
      COLLECTIONS_CONSTS.WATCH_LATER_ID,
      contentPermanentUri
    )(state),
    hasClaimInFavorites: makeSelectCollectionForIdHasClaimUrl(
      COLLECTIONS_CONSTS.FAVORITES_ID,
      contentPermanentUri
    )(state),
    channelIsMuted: makeSelectChannelIsMuted(contentChannelUri)(state),
    channelIsBlocked: makeSelectChannelIsBlocked(contentChannelUri)(state),
    fileInfo: makeSelectFileInfoForUri(contentPermanentUri)(state),
    isSubscribed: makeSelectIsSubscribed(contentChannelUri, true)(state),
    channelIsAdminBlocked: makeSelectChannelIsAdminBlocked(props.uri)(state),
    isAdmin: selectHasAdminChannel(state),
    claimInCollection: makeSelectCollectionForIdHasClaimUrl(collectionId, contentPermanentUri)(state),
    isMyCollection: makeSelectCollectionIsMine(collectionId)(state),
    editedCollection: makeSelectEditedCollectionForId(collectionId)(state),
    isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
    resolvedList: makeSelectUrlsForCollectionId(collectionId)(state),
    playNextUri,
  };
};

const perform = (dispatch) => ({
  prepareEdit: (publishData, uri, fileInfo) => {
    if (publishData.signing_channel) {
      dispatch(doSetIncognito(false));
      dispatch(doSetActiveChannel(publishData.signing_channel.claim_id));
    } else {
      dispatch(doSetIncognito(true));
    }

    dispatch(doPrepareEdit(publishData, uri, fileInfo, fs));
  },
  doToast: (props) => dispatch(doToast(props)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doChannelMute: (channelUri) => dispatch(doChannelMute(channelUri)),
  doChannelUnmute: (channelUri) => dispatch(doChannelUnmute(channelUri)),
  doCommentModBlock: (channelUri) => dispatch(doCommentModBlock(channelUri)),
  doCommentModUnBlock: (channelUri) => dispatch(doCommentModUnBlock(channelUri)),
  doCommentModBlockAsAdmin: (commenterUri, blockerId) => dispatch(doCommentModBlockAsAdmin(commenterUri, blockerId)),
  doCommentModUnBlockAsAdmin: (commenterUri, blockerId) =>
    dispatch(doCommentModUnBlockAsAdmin(commenterUri, blockerId)),
  doChannelSubscribe: (subscription) => dispatch(doChannelSubscribe(subscription)),
  doChannelUnsubscribe: (subscription) => dispatch(doChannelUnsubscribe(subscription)),
  doCollectionEdit: (collection, props) => dispatch(doCollectionEdit(collection, props)),
  fetchCollectionItems: (collectionId) => dispatch(doFetchItemsInCollection({ collectionId })),
  doToggleShuffleList: (collectionId) => {
    dispatch(doToggleLoopList(collectionId, false, true));
    dispatch(doToggleShuffleList(undefined, collectionId, true, true));
  },
});

export default connect(select, perform)(ClaimPreview);
