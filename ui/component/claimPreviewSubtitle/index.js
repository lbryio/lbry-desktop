import * as PAGES from 'constants/pages';
import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsPending } from 'redux/selectors/claims';
import { doClearPublish, doPrepareEdit } from 'redux/actions/publish';
import { push } from 'connected-react-router';
import ClaimPreviewSubtitle from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  pending: makeSelectClaimIsPending(props.uri)(state),
});

const perform = (dispatch) => ({
  beginPublish: (name) => {
    dispatch(doClearPublish());
    dispatch(doPrepareEdit({ name }));
    dispatch(push(`/$/${PAGES.UPLOAD}`));
  },
});

export default connect(select, perform)(ClaimPreviewSubtitle);
