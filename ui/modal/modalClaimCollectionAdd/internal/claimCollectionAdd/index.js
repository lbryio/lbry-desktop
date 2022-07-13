import { connect } from 'react-redux';
import ClaimCollectionAdd from './view';
import { withRouter } from 'react-router';
import { selectCollectionValuesListForKey } from 'redux/selectors/collections';
import { selectPermanentUrlForUri } from 'redux/selectors/claims';
import * as COLLECTIONS_CONSTANTS from 'constants/collections';

const select = (state, props) => {
  const { uri } = props;

  return {
    // lists can only use permanent_url
    uri: selectPermanentUrlForUri(state, uri),
    builtin: selectCollectionValuesListForKey(state, COLLECTIONS_CONSTANTS.COL_KEY_BUILTIN),
    queue: selectCollectionValuesListForKey(state, COLLECTIONS_CONSTANTS.QUEUE_ID),
    published: selectCollectionValuesListForKey(state, COLLECTIONS_CONSTANTS.COL_KEY_PUBLISHED),
    unpublished: selectCollectionValuesListForKey(state, COLLECTIONS_CONSTANTS.COL_KEY_UNPUBLISHED),
  };
};

export default withRouter(connect(select)(ClaimCollectionAdd));
