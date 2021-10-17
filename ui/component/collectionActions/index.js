import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsPending } from 'redux/selectors/claims';
import { makeSelectCollectionIsMine, makeSelectEditedCollectionForId } from 'redux/selectors/collections';
import { doOpenModal } from 'redux/actions/app';
import { selectListShuffle } from 'redux/selectors/content';
import { doToggleShuffleList, doToggleLoopList } from 'redux/actions/content';
import CollectionActions from './view';

const select = (state, props) => {
  let firstItem;
  const collectionUrls = props.collectionUrls;
  if (collectionUrls) {
    // this will help play the first valid claim in a list
    // in case the first urls have been deleted
    collectionUrls.map((url) => {
      const claim = makeSelectClaimForUri(url)(state);
      if (firstItem === undefined && claim) {
        firstItem = claim.permanent_url;
      }
    });
  }
  const collectionId = props.collectionId;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];

  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsPending: makeSelectClaimIsPending(props.uri)(state),
    isMyCollection: makeSelectCollectionIsMine(collectionId)(state),
    collectionHasEdits: Boolean(makeSelectEditedCollectionForId(collectionId)(state)),
    firstItem,
    playNextUri,
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToggleShuffleList: (collectionId, shuffle) => {
    dispatch(doToggleLoopList(collectionId, false, true));
    dispatch(doToggleShuffleList(undefined, collectionId, shuffle, true));
  },
});

export default connect(select, perform)(CollectionActions);
