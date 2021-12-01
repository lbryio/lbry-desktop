import { connect } from 'react-redux';
import { makeSelectNameForCollectionId } from 'redux/selectors/collections';
import { doOpenModal } from 'redux/actions/app';
import { selectListShuffle } from 'redux/selectors/content';
import { doToggleLoopList, doToggleShuffleList } from 'redux/actions/content';
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

const perform = (dispatch) => ({
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToggleShuffleList: (collectionId) => {
    dispatch(doToggleLoopList(collectionId, false, true));
    dispatch(doToggleShuffleList(undefined, collectionId, true, true));
  },
});

export default connect(select, perform)(CollectionMenuList);
