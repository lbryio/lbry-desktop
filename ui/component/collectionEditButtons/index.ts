//@ts-nocheck
import { connect } from "react-redux";
import { doCollectionEdit } from "redux/actions/collections";
import { makeSelectIndexForUrlInCollection, makeSelectUrlsForCollectionId } from "redux/selectors/collections";
import CollectionButtons from "./view";

const select = (state: unknown, props: unknown) => {
  const { uri, collectionId } = props;

  return {
    collectionIndex: makeSelectIndexForUrlInCollection(uri, collectionId, true)(state),
    collectionUris: makeSelectUrlsForCollectionId(collectionId)(state),
  };
};

const perform = (dispatch: unknown, ownProps: unknown) => {
  const { collectionId } = ownProps;

  return {
    editCollection: (params) => dispatch(doCollectionEdit(collectionId, params)),
  };
};

export default connect(select, perform)(CollectionButtons);
