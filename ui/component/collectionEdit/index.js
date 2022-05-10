import { connect } from 'react-redux';
import {
  selectTitleForUri,
  selectThumbnailForUri,
  makeSelectMetadataItemForUri,
  makeSelectAmountForUri,
  makeSelectClaimForUri,
  selectUpdateCollectionError,
  selectUpdatingCollection,
  selectCreateCollectionError,
  selectCreatingCollection,
} from 'redux/selectors/claims';
import {
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectClaimIdsForCollectionId,
} from 'redux/selectors/collections';
import { doCollectionPublish, doCollectionPublishUpdate } from 'redux/actions/claims';
import { selectBalance } from 'redux/selectors/wallet';
import * as ACTIONS from 'constants/action_types';

import CollectionForm from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { doCollectionEdit } from 'redux/actions/collections';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: selectTitleForUri(state, props.uri),
  thumbnailUrl: selectThumbnailForUri(state, props.uri),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  tags: makeSelectMetadataItemForUri(props.uri, 'tags')(state),
  locations: makeSelectMetadataItemForUri(props.uri, 'locations')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
  amount: makeSelectAmountForUri(props.uri)(state),
  updateError: selectUpdateCollectionError(state),
  updatingCollection: selectUpdatingCollection(state),
  createError: selectCreateCollectionError(state),
  creatingCollection: selectCreatingCollection(state),
  balance: selectBalance(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  incognito: selectIncognito(state),
  collection: makeSelectCollectionForId(props.collectionId)(state),
  collectionUrls: makeSelectUrlsForCollectionId(props.collectionId)(state),
  collectionClaimIds: makeSelectClaimIdsForCollectionId(props.collectionId)(state),
});

const perform = (dispatch, ownProps) => ({
  publishCollectionUpdate: (params) => dispatch(doCollectionPublishUpdate(params)),
  publishCollection: (params, collectionId) => dispatch(doCollectionPublish(params, collectionId)),
  clearCollectionErrors: () => dispatch({ type: ACTIONS.CLEAR_COLLECTION_ERRORS }),
  doCollectionEdit: (params) => dispatch(doCollectionEdit(ownProps.collectionId, params)),
});

export default connect(select, perform)(CollectionForm);
