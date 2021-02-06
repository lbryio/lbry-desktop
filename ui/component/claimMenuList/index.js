import { connect } from 'react-redux';
import {
  doCollectionEdit,
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  makeSelectCollectionForIdHasClaimUrl,
  makeSelectNameForCollectionId,
  makeSelectCollectionIsMine,
  COLLECTIONS_CONSTS,
} from 'lbry-redux';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToggleMuteChannel } from 'redux/actions/blocked';
import { doCommentModBlock, doCommentModUnBlock } from 'redux/actions/comments';
import { makeSelectChannelIsBlocked } from 'redux/selectors/comments';
import { doOpenModal } from 'redux/actions/app';
import { doToast } from 'redux/actions/notifications';
import { makeSelectUserPropForProp } from 'redux/selectors/user';
import ClaimPreview from './view';
import * as USER from 'constants/user';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const permanentUri = claim && claim.permanent_url;
  return {
    claim,
    claimIsMine: props.channelIsMine
      ? props.isRepost
        ? makeSelectClaimIsMine(props.uri)(state)
        : true
      : makeSelectClaimIsMine(props.uri)(state),
    hasClaimInWatchLater: makeSelectCollectionForIdHasClaimUrl(COLLECTIONS_CONSTS.WATCH_LATER_ID, permanentUri)(state),
    channelIsMuted: makeSelectChannelIsMuted(props.uri)(state),
    channelIsBlocked: makeSelectChannelIsBlocked(props.uri)(state),
    claimInCollection: makeSelectCollectionForIdHasClaimUrl(props.collectionId, permanentUri)(state),
    collectionName: makeSelectNameForCollectionId(props.collectionId)(state),
    isMyCollection: makeSelectCollectionIsMine(props.collectionId)(state),
    hasExperimentalUi: makeSelectUserPropForProp(USER.EXPERIMENTAL_UI)(state),
  };
};

export default connect(select, {
  doToggleMuteChannel,
  doCommentModBlock,
  doCommentModUnBlock,
  doCollectionEdit,
  doOpenModal,
  doToast,
})(ClaimPreview);
