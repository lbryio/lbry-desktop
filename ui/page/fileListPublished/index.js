import { connect } from 'react-redux';
import {
  selectIsFetchingAllMyClaims,
  selectFetchingMyClaimsPageError,
  selectAllMyClaims,
} from 'redux/selectors/claims';
import { doCheckPendingClaims, doFetchAllClaimListMine } from 'redux/actions/claims';
import { doClearPublish } from 'redux/actions/publish';
import FileListPublished from './view';
import { withRouter } from 'react-router';
import { MY_CLAIMS_PAGE_SIZE, PAGE_PARAM, PAGE_SIZE_PARAM } from 'constants/claim';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get(PAGE_PARAM)) || '1';
  const pageSize = urlParams.get(PAGE_SIZE_PARAM) || String(MY_CLAIMS_PAGE_SIZE);

  return {
    page,
    pageSize,
    fetching: selectIsFetchingAllMyClaims(state),
    error: selectFetchingMyClaimsPageError(state),
    myClaims: selectAllMyClaims(state),
  };
};

const perform = (dispatch) => ({
  checkPendingPublishes: () => dispatch(doCheckPendingClaims()),
  clearPublish: () => dispatch(doClearPublish()),
  fetchAllMyClaims: () => dispatch(doFetchAllClaimListMine()),
});

export default withRouter(connect(select, perform)(FileListPublished));
