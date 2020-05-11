import { connect } from 'react-redux';
import {
  selectIsFetchingClaimListMine,
  selectMyClaimsPage,
  selectMyClaimsPageItemCount,
  selectFetchingMyClaimsPageError,
  doClearPublish,
  doFetchClaimListMine,
} from 'lbry-redux';
import { selectUploadCount } from 'lbryinc';
import { doCheckPendingPublishesApp } from 'redux/actions/publish';
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

const perform = dispatch => ({
  checkPendingPublishes: () => dispatch(doCheckPendingPublishesApp()),
  fetchClaimListMine: (page, pageSize) => dispatch(doFetchClaimListMine(page, pageSize)),
  clearPublish: () => dispatch(doClearPublish()),
});

export default withRouter(connect(select, perform)(FileListPublished));
