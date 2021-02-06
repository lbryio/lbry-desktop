import { connect } from 'react-redux';
import { doCollectionEdit, makeSelectNameForCollectionId, doCollectionDelete } from 'lbry-redux';
import { doOpenModal } from 'redux/actions/app';
import CollectionMenuList from './view';

const select = (state, props) => {
  return {
    collectionName: makeSelectNameForCollectionId(props.collectionId)(state),
  };
};

export default connect(select, {
  doCollectionEdit,
  doOpenModal,
  doCollectionDelete,
})(CollectionMenuList);
