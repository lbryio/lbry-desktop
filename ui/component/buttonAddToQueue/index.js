import { connect } from 'react-redux';
import { doCollectionEdit } from 'redux/actions/collections';
import { selectCollectionForIdHasClaimUrl, selectUrlsForCollectionId } from 'redux/selectors/collections';
import { selectClaimForUri } from 'redux/selectors/claims';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import ButtonAddToQueue from './view';
import { doToast } from 'redux/actions/notifications';
import { doUriInitiatePlay, doSetPlayingUri } from 'redux/actions/content';
import { selectPlayingUri } from 'redux/selectors/content';

const select = (state, props) => {
  const { uri } = props;

  const playingUri = selectPlayingUri(state);
  const { collectionId } = playingUri.collection || {};
  const { permanent_url: playingUrl } = selectClaimForUri(state, playingUri.uri) || {};

  return {
    playingUri,
    playingUrl,
    hasClaimInQueue: selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, uri),
    hasPlayingUriInQueue: Boolean(
      playingUrl && selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.QUEUE_ID, playingUrl)
    ),
    playingCollectionUrls:
      collectionId && collectionId !== COLLECTIONS_CONSTS.QUEUE_ID && selectUrlsForCollectionId(state, collectionId),
  };
};

const perform = {
  doToast,
  doCollectionEdit,
  doUriInitiatePlay,
  doSetPlayingUri,
};

export default connect(select, perform)(ButtonAddToQueue);
