import { connect } from 'react-redux';
import { doCollectionPublishUpdate, makeSelectEditedCollectionForId, selectUpdatingCollection } from 'lbry-redux';
import CollectionQuickUpdateButton from './view';
import { doToast } from 'redux/actions/notifications';

const select = (state, props) => ({
  isEdit: Boolean(makeSelectEditedCollectionForId(props.collectionId)(state)),
  isUpdatingCollection: selectUpdatingCollection(state),
});

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
  collectionPublishUpdate: (options) => dispatch(doCollectionPublishUpdate(options, true)),
});

export default connect(select, perform)(CollectionQuickUpdateButton);
