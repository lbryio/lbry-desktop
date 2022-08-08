import FeaturedChannelsEdit from './view';
import { connect } from 'react-redux';
import { doCollectionEdit, doLocalCollectionCreate } from 'redux/actions/collections';
import { selectCollectionForId } from 'redux/selectors/collections';

const select = (state, props) => ({
  collection: selectCollectionForId(state, props.collectionId),
});

const perform = {
  doLocalCollectionCreate,
  doCollectionEdit,
};

export default connect(select, perform)(FeaturedChannelsEdit);
