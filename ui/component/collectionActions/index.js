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
import { doPlayUri, doSetPlayingUri, doToggleShuffleList, doToggleLoopList } from 'redux/actions/content';
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

  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    claimIsMine: makeSelectClaimIsMine(props.uri)(state),
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    myChannels: selectMyChannelClaims(state),
    claimIsPending: makeSelectClaimIsPending(props.uri)(state),
    isMyCollection: makeSelectCollectionIsMine(props.collectionId)(state),
    collectionHasEdits: Boolean(makeSelectEditedCollectionForId(props.collectionId)(state)),
    firstItem,
  };
};

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doToast: (options) => dispatch(doToast(options)),
  doPlayUri: (uri) => dispatch(doPlayUri(uri)),
  doSetPlayingUri: (uri) => dispatch(doSetPlayingUri({ uri })),
  doToggleShuffleList: (collectionId, shuffle) => dispatch(doToggleShuffleList(undefined, collectionId, shuffle, true)),
  doToggleLoopList: (collectionId, loop) => dispatch(doToggleLoopList(collectionId, loop)),
});

export default connect(select, perform)(CollectionActions);
