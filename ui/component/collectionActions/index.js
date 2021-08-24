import { connect } from 'react-redux';
import {
  makeSelectClaimIsMine,
  makeSelectClaimForUri,
  selectMyChannelClaims,
  makeSelectClaimIsPending,
  makeSelectCollectionIsMine,
  makeSelectEditedCollectionForId,
} from 'lbry-redux';
import { makeSelectCostInfoForUri } from 'lbryinc';
import { doToast } from 'redux/actions/notifications';
import { doOpenModal } from 'redux/actions/app';
import { selectListShuffle } from 'redux/selectors/content';
import { doSetPlayingUri, doToggleShuffleList } from 'redux/actions/content';
import CollectionActions from './view';

const select = (state, props) => {
  const collectionId = props.collectionId;
  const shuffleList = selectListShuffle(state);
  const shuffle = shuffleList && shuffleList.collectionId === collectionId && shuffleList.newUrls;
  const playNextUri = shuffle && shuffle[0];

  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    myChannels: selectMyChannelClaims(state),
    claimIsPending: makeSelectClaimIsPending(props.uri)(state),
    isMyCollection: makeSelectCollectionIsMine(props.collectionId)(state),
    collectionHasEdits: Boolean(makeSelectEditedCollectionForId(props.collectionId)(state)),
    playNextUri,
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
  doSetPlayingUri: (uri) => dispatch(doSetPlayingUri({ uri })),
  doToggleShuffleList: (collectionId) => dispatch(doToggleShuffleList(undefined, collectionId, true, true)),
});

export default connect(select, perform)(CollectionActions);
