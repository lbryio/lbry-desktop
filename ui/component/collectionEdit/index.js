import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectMetadataItemForUri,
  doCollectionPublish,
  doCollectionPublishUpdate,
  makeSelectAmountForUri,
  makeSelectClaimForUri,
  selectUpdateCollectionError,
  selectUpdatingCollection,
  selectCreateCollectionError,
  selectBalance,
  doClearCollectionErrors,
  selectCreatingCollection,
  makeSelectCollectionForId,
  makeSelectUrlsForCollectionId,
  makeSelectClaimIdsForCollectionId,
} from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';

import CollectionPage from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnailUrl: makeSelectThumbnailForUri(props.uri)(state),
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

const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  publishCollectionUpdate: (params) => dispatch(doCollectionPublishUpdate(params)),
  publishCollection: (params, collectionId) => dispatch(doCollectionPublish(params, collectionId)),
  clearCollectionErrors: () => dispatch(doClearCollectionErrors()),
});

export default connect(select, perform)(CollectionPage);
