import { connect } from 'react-redux';
import ClaimCollectionAdd from './view';
import { withRouter } from 'react-router';
import {
  selectBuiltinCollections,
  selectMyPublishedCollections,
  selectMyUnpublishedCollections,
} from 'redux/selectors/collections';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { doLocalCollectionCreate } from 'redux/actions/collections';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  builtin: selectBuiltinCollections(state),
  published: selectMyPublishedCollections(state),
  unpublished: selectMyUnpublishedCollections(state),
});

const perform = (dispatch) => ({
  addCollection: (name, items, type) => dispatch(doLocalCollectionCreate(name, items, type)),
});

export default withRouter(connect(select, perform)(ClaimCollectionAdd));
