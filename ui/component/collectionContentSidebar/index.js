import { connect } from 'react-redux';
import CollectionContent from './view';
import { selectClaimForUri } from 'redux/selectors/claims';
import {
  makeSelectUrlsForCollectionId,
  makeSelectNameForCollectionId,
  makeSelectCollectionForId,
  makeSelectCollectionIsMine,
} from 'redux/selectors/collections';
import { selectPlayingUri, selectListLoop, selectListShuffle } from 'redux/selectors/content';
import { doToggleLoopList, doToggleShuffleList } from 'redux/actions/content';
import { doCollectionEdit } from 'redux/actions/collections';

const select = (state, props) => {
  const { uri: playingUri } = selectPlayingUri(state);
  const { permanent_url: url } = selectClaimForUri(state, playingUri) || {};

  const loopList = selectListLoop(state);
  const loop = loopList && loopList.collectionId === props.id && loopList.loop;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === props.id && shuffleList.newUrls;

  return {
    url,
    collection: makeSelectCollectionForId(props.id)(state),
    collectionUrls: makeSelectUrlsForCollectionId(props.id)(state),
    collectionName: makeSelectNameForCollectionId(props.id)(state),
    isMyCollection: makeSelectCollectionIsMine(props.id)(state),
    loop,
    shuffle,
  };
};

export default connect(select, {
  doToggleLoopList,
  doToggleShuffleList,
  doCollectionEdit,
})(CollectionContent);
