import { connect } from 'react-redux';
import {
  doCollectionEdit,
  makeSelectClaimForUri,
  makeSelectFileInfoForUri,
  doPrepareEdit,
  makeSelectCollectionForIdHasClaimUrl,
  makeSelectCollectionIsMine,
  COLLECTIONS_CONSTS,
  makeSelectEditedCollectionForId,
  makeSelectClaimIsMine,
} from 'lbry-redux';
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
import ClaimPreview from './view';
import fs from 'fs';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri, false)(state);
  const repostedClaim = claim && claim.reposted_claim;
  const contentClaim = repostedClaim || claim;
  const contentSigningChannel = contentClaim && contentClaim.signing_channel;
  const contentPermanentUri = contentClaim && contentClaim.permanent_url;
  const contentChannelUri = (contentSigningChannel && contentSigningChannel.permanent_url) || contentPermanentUri;

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
    claimInCollection: makeSelectCollectionForIdHasClaimUrl(props.collectionId, contentPermanentUri)(state),
    isMyCollection: makeSelectCollectionIsMine(props.collectionId)(state),
    editedCollection: makeSelectEditedCollectionForId(props.collectionId)(state),
    isAuthenticated: Boolean(selectUserVerifiedEmail(state)),
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
});

export default connect(select, perform)(ClaimPreview);
