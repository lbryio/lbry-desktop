import * as PAGES from 'constants/pages';
import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectClaimIsPending,
  doClearPublish,
  doPrepareEdit,
  makeSelectClaimIsStreamPlaceholder,
} from 'lbry-redux';
import { push } from 'connected-react-router';
import ClaimPreviewSubtitle from './view';
import { doFetchSubCount, makeSelectSubCountForUri } from 'lbryinc';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  pending: makeSelectClaimIsPending(props.uri)(state),
  isLivestream: makeSelectClaimIsStreamPlaceholder(props.uri)(state),
  subCount: makeSelectSubCountForUri(props.uri)(state),
});

const perform = (dispatch) => ({
  beginPublish: (name) => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
  fetchSubCount: (claimId) => dispatch(doFetchSubCount(claimId)),
});

export default connect(select, perform)(ClaimPreviewSubtitle);
