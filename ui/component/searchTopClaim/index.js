import { connect } from 'react-redux';
import { doClearPublish, doPrepareEdit } from 'redux/actions/publish';
import { doResolveUris } from 'redux/actions/claims';
import { selectPendingIds, makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectWinningUriForQuery, makeSelectIsResolvingWinningUri } from 'redux/selectors/search';
import SearchTopClaim from './view';
import { push } from 'connected-react-router';
import * as PAGES from 'constants/pages';

const select = (state, props) => {
  const winningUri = makeSelectWinningUriForQuery(props.query)(state);

  return {
    winningUri,
    winningClaim: winningUri ? makeSelectClaimForUri(winningUri)(state) : undefined,
    isResolvingWinningUri: props.query ? makeSelectIsResolvingWinningUri(props.query)(state) : false,
    pendingIds: selectPendingIds(state),
  };
};

const perform = (dispatch) => ({
  beginPublish: (name) => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
  doResolveUris: (uris) => dispatch(doResolveUris(uris)),
});

export default connect(select, perform)(SearchTopClaim);
