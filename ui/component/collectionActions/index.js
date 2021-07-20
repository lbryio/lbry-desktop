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
import CollectionActions from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  myChannels: selectMyChannelClaims(state),
  claimIsPending: makeSelectClaimIsPending(props.uri)(state),
  isMyCollection: makeSelectCollectionIsMine(props.collectionId)(state),
  collectionHasEdits: Boolean(makeSelectEditedCollectionForId(props.collectionId)(state)),
});

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(CollectionActions);
