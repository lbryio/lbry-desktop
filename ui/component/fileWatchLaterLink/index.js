import { connect } from 'react-redux';
import { doCollectionEdit } from 'redux/actions/collections';
import { makeSelectCollectionForIdHasClaimUrl } from 'redux/selectors/collections';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import FileWatchLaterLink from './view';
import { doToast } from 'redux/actions/notifications';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const permanentUri = claim && claim.permanent_url;

  return {
    claim,
    hasClaimInWatchLater: makeSelectCollectionForIdHasClaimUrl(COLLECTIONS_CONSTS.WATCH_LATER_ID, permanentUri)(state),
  };
};

const perform = (dispatch) => ({
  doToast: (props) => dispatch(doToast(props)),
  doCollectionEdit: (collection, props) => dispatch(doCollectionEdit(collection, props)),
});

export default connect(select, perform)(FileWatchLaterLink);
