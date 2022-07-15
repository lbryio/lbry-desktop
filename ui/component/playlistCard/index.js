import { connect } from 'react-redux';
import PlaylistCard from './view';
import { selectClaimForUri } from 'redux/selectors/claims';
import {
  selectUrlsForCollectionId,
  selectNameForCollectionId,
  selectCollectionIsMine,
  selectIsCollectionPrivateForId,
  selectPublishedCollectionChannelNameForId,
  selectIndexForUrlInCollection,
  selectCollectionLengthForId,
  selectCollectionIsEmptyForId,
  selectCollectionForId,
} from 'redux/selectors/collections';
import { selectPlayingUri } from 'redux/selectors/content';
import { doCollectionEdit, doClearQueueList } from 'redux/actions/collections';
import { doClearPlayingCollection } from 'redux/actions/content';
import { doOpenModal } from 'redux/actions/app';

const select = (state, props) => {
  const { id: collectionId } = props;

  const {
    uri: playingUri,
    collection: { collectionId: playingCollectionId },
  } = selectPlayingUri(state);

  const playingCurrentPlaylist = collectionId === playingCollectionId;
  const { permanent_url: playingItemUrl } = playingCurrentPlaylist ? selectClaimForUri(state, playingUri) || {} : {};
  const playingItemIndex = selectIndexForUrlInCollection(state, playingItemUrl, playingCollectionId, true);

  return {
    playingItemUrl,
    playingCurrentPlaylist,
    collectionUrls: selectUrlsForCollectionId(state, collectionId),
    collectionName: selectNameForCollectionId(state, collectionId),
    isMyCollection: selectCollectionIsMine(state, collectionId),
    isPrivateCollection: selectIsCollectionPrivateForId(state, collectionId),
    publishedCollectionName: selectPublishedCollectionChannelNameForId(state, collectionId),
    playingItemIndex: playingItemIndex !== null ? playingItemIndex + 1 : 0,
    collectionLength: selectCollectionLengthForId(state, collectionId),
    collectionEmpty: selectCollectionIsEmptyForId(state, collectionId),
    hasCollectionById: collectionId && Boolean(selectCollectionForId(state, collectionId)),
    playingCollectionId,
  };
};

const perform = {
  doCollectionEdit,
  doClearPlayingCollection,
  doClearQueueList,
  doOpenModal,
};

export default connect(select, perform)(PlaylistCard);
