import { connect } from 'react-redux';
import {
  selectHasClaimForUri,
  makeSelectAmountForUri,
  selectUpdateCollectionError,
  selectUpdatingCollection,
  selectCreateCollectionError,
  selectCreatingCollection,
} from 'redux/selectors/claims';
import { doClearCollectionErrors } from 'redux/actions/collections';
import { selectClaimIdsForCollectionId, selectCollectionForId } from 'redux/selectors/collections';
import { doCollectionPublish, doCollectionPublishUpdate } from 'redux/actions/claims';
import { selectBalance } from 'redux/selectors/wallet';
import { selectCollectionClaimParamsForUri } from 'redux/selectors/publish';
import { selectActiveChannelClaim } from 'redux/selectors/app';

import CollectionForm from './view';

const select = (state, props) => {
  const { uri, collectionId } = props;

  return {
    hasClaim: selectHasClaimForUri(state, uri),
    amount: makeSelectAmountForUri(uri)(state),
    updateError: selectUpdateCollectionError(state),
    updatingCollection: selectUpdatingCollection(state),
    createError: selectCreateCollectionError(state),
    creatingCollection: selectCreatingCollection(state),
    balance: selectBalance(state),
    collection: selectCollectionForId(state, collectionId),
    collectionClaimIds: selectClaimIdsForCollectionId(state, collectionId),
    collectionParams: selectCollectionClaimParamsForUri(state, uri, collectionId),
    activeChannelClaim: selectActiveChannelClaim(state),
  };
};

const perform = {
  doCollectionPublishUpdate,
  doCollectionPublish,
  doClearCollectionErrors,
};

export default connect(select, perform)(CollectionForm);
