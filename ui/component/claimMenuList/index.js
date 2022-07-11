import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { doCollectionEdit, doFetchItemsInCollection } from 'redux/actions/collections';
import { doPrepareEdit } from 'redux/actions/publish';
import { doRemovePersonalRecommendation } from 'redux/actions/search';
import {
  makeSelectCollectionForId,
  makeSelectCollectionForIdHasClaimUrl,
  makeSelectCollectionIsMine,
  makeSelectEditedCollectionForId,
  makeSelectUrlsForCollectionId,
  selectLastUsedCollection,
} from 'redux/selectors/collections';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doChannelMute, doChannelUnmute } from 'redux/actions/blocked';
import { doOpenModal } from 'redux/actions/app';
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
import { selectIsSubscribedForUri } from 'redux/selectors/subscriptions';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectListShuffle, makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { doToggleLoopList, doToggleShuffleList } from 'redux/actions/content';
import { isStreamPlaceholderClaim } from 'util/claim';
import * as RENDER_MODES from 'constants/file_render_modes';
import ClaimPreview from './view';

const select = (state, props) => {
  const { uri } = props;
  const claim = selectClaimForUri(state, uri, false);
  const collectionId = props.collectionId;
  const repostedClaim = claim && claim.reposted_claim;
  const contentClaim = repostedClaim || claim;
  const contentSigningChannel = contentClaim && contentClaim.signing_channel;
  const contentPermanentUri = contentClaim && contentClaim.permanent_url;
  const contentChannelUri = (contentSigningChannel && contentSigningChannel.permanent_url) || contentPermanentUri;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];
  const lastUsedCollectionId = selectLastUsedCollection(state);
  const lastUsedCollection = makeSelectCollectionForId(lastUsedCollectionId)(state);
  const isLivestreamClaim = isStreamPlaceholderClaim(claim);
  const permanentUrl = (claim && claim.permanent_url) || '';
  const isPostClaim = makeSelectFileRenderModeForUri(permanentUrl)(state) === RENDER_MODES.MARKDOWN;

  return {
    claim,
    repostedClaim,
    contentClaim,
    contentSigningChannel,
    contentChannelUri,
    isLivestreamClaim,
    isPostClaim,
    claimIsMine: selectClaimIsMine(state, claim),
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
    isSubscribed: selectIsSubscribedForUri(state, contentChannelUri),
    channelIsAdminBlocked: makeSelectChannelIsAdminBlocked(props.uri)(state),
    isAdmin: selectHasAdminChannel(state),
    claimInCollection: makeSelectCollectionForIdHasClaimUrl(collectionId, contentPermanentUri)(state),
    isMyCollection: makeSelectCollectionIsMine(collectionId)(state),
    editedCollection: makeSelectEditedCollectionForId(collectionId)(state),
    isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
    resolvedList: makeSelectUrlsForCollectionId(collectionId)(state),
    playNextUri,
    lastUsedCollection,
    hasClaimInLastUsedCollection: makeSelectCollectionForIdHasClaimUrl(
      lastUsedCollectionId,
      contentPermanentUri
    )(state),
    lastUsedCollectionIsNotBuiltin:
      lastUsedCollectionId !== COLLECTIONS_CONSTS.WATCH_LATER_ID &&
      lastUsedCollectionId !== COLLECTIONS_CONSTS.FAVORITES_ID,
  };
};

const perform = (dispatch) => ({
  prepareEdit: (publishData, uri, claimType) => dispatch(doPrepareEdit(publishData, uri, claimType)),
  doToast: (props) => dispatch(doToast(props)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doChannelMute: (channelUri) => dispatch(doChannelMute(channelUri)),
  doChannelUnmute: (channelUri) => dispatch(doChannelUnmute(channelUri)),
  doCommentModBlock: (channelUri) => dispatch(doCommentModBlock(channelUri)),
  doCommentModUnBlock: (channelUri) => dispatch(doCommentModUnBlock(channelUri)),
  doCommentModBlockAsAdmin: (a, b, c) => dispatch(doCommentModBlockAsAdmin(a, b, c)),
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
  doRemovePersonalRecommendation: (uri) => dispatch(doRemovePersonalRecommendation(uri)),
});

export default connect(select, perform)(ClaimPreview);
