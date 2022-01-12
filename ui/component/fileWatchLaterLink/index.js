import { connect } from 'react-redux';
import { doCollectionEdit } from 'redux/actions/collections';
import { makeSelectCollectionForIdHasClaimUrl } from 'redux/selectors/collections';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import FileWatchLaterLink from './view';
import { doToast } from 'redux/actions/notifications';

const select = (state, props) => {
  const { uri } = props;

  return {
    hasClaimInWatchLater: makeSelectCollectionForIdHasClaimUrl(COLLECTIONS_CONSTS.WATCH_LATER_ID, uri)(state),
  };
};

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
  doCollectionEdit: (collection, props) => dispatch(doCollectionEdit(collection, props)),
});

export default connect(select, perform)(FileWatchLaterLink);
