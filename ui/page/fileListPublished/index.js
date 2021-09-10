import { connect } from 'react-redux';
import {
  selectIsFetchingClaimListMine,
  selectMyClaimsPage,
  selectMyClaimsPageItemCount,
  selectFetchingMyClaimsPageError,
} from 'redux/selectors/claims';
import { doFetchClaimListMine, doCheckPendingClaims } from 'redux/actions/claims';
import { doClearPublish } from 'redux/actions/publish';
import { selectUploadCount } from 'lbryinc';
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
    fetching: selectIsFetchingClaimListMine(state),
    urls: selectMyClaimsPage(state),
    urlTotal: selectMyClaimsPageItemCount(state),
    error: selectFetchingMyClaimsPageError(state),
    uploadCount: selectUploadCount(state),
  };
};

const perform = (dispatch) => ({
  checkPendingPublishes: () => dispatch(doCheckPendingClaims()),
  fetchClaimListMine: (page, pageSize, resolve, filterBy) =>
    dispatch(doFetchClaimListMine(page, pageSize, resolve, filterBy)),
  clearPublish: () => dispatch(doClearPublish()),
});

export default withRouter(connect(select, perform)(FileListPublished));
