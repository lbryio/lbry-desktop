import { connect } from 'react-redux';
import ClaimCollectionAdd from './view';
import { withRouter } from 'react-router';
import {
  doResolveUris,
  makeSelectClaimForUri,
  doLocalCollectionCreate,
  selectBuiltinCollections,
  selectMyPublishedCollections,
  selectMyUnpublishedCollections,
  doCollectionEdit,
  makeSelectUrlsForCollectionId,
} from 'lbry-redux';

const select = (state, props) => {
  const collectionId = props.collectionId;
  let items;
  let itemsClaims = [];

  if (collectionId) {
    items = makeSelectUrlsForCollectionId(collectionId)(state);
    items.map((uri) => {
      itemsClaims.push(makeSelectClaimForUri(uri)(state));
    });
  }

  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    builtin: selectBuiltinCollections(state),
    published: selectMyPublishedCollections(state),
    unpublished: selectMyUnpublishedCollections(state),
    items,
    itemsClaims,
  };
};

const perform = (dispatch) => ({
  addCollection: (name, items, type) => dispatch(doLocalCollectionCreate(name, items, type)),
  editCollection: (id, params) => dispatch(doCollectionEdit(id, params)),
  doResolveUris: (uris) => dispatch(doResolveUris(uris)),
});

export default withRouter(connect(select, perform)(ClaimCollectionAdd));
