import { connect } from 'react-redux';
import { doCollectionEdit, makeSelectNameForCollectionId, doCollectionDelete } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import { selectListShuffle } from 'redux/selectors/content';
import { doSetPlayingUri, doToggleShuffleList } from 'redux/actions/content';
import CollectionMenuList from './view';

const select = (state, props) => {
  const collectionId = props.collectionId;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];

  return {
    collectionName: makeSelectNameForCollectionId(props.collectionId)(state),
    playNextUri,
  };
};

export default connect(select, {
  doCollectionEdit,
  doOpenModal,
  doCollectionDelete,
  doSetPlayingUri,
  doToggleShuffleList,
})(CollectionMenuList);
