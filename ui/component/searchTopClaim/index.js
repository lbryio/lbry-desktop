import { connect } from 'react-redux';
import { doResolveUris, doClearPublish, doPrepareEdit, selectPendingIds } from 'lbry-redux';
//
import { makeSelectWinningUriForQuery } from 'redux/selectors/search';
import SearchTopClaim from './view';
import { push } from 'connected-react-router';
import * as PAGES from 'constants/pages';

const select = (state, props) => ({
  winningUri: makeSelectWinningUriForQuery(props.query)(state),
  pendingIds: selectPendingIds(state),
});

const perform = dispatch => ({
  // eslint-disable-next-line no-undef
  beginPublish: name => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
  doResolveUris: uris => dispatch(doResolveUris(uris)),
});

export default connect(select, perform)(SearchTopClaim);
