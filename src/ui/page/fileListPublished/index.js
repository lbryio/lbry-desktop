import { connect } from 'react-redux';
import {
  selectIsFetchingClaimListMine,
  makeSelectMyStreamUrlsForPage,
  selectMyStreamUrlsCount,
  doFetchClaimListMine,
} from 'lbry-redux';
import { doCheckPendingPublishesApp } from 'redux/actions/publish';
import FileListPublished from './view';
import { withRouter } from 'react-router';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get('page')) || 1;
  return {
    page,
    urls: makeSelectMyStreamUrlsForPage(page)(state),
    urlTotal: selectMyStreamUrlsCount(state),
    fetching: selectIsFetchingClaimListMine(state),
  };
};

const perform = dispatch => ({
  checkPendingPublishes: () => dispatch(doCheckPendingPublishesApp()),
  fetchClaimListMine: () => dispatch(doFetchClaimListMine()),
});

export default withRouter(
  connect(
    select,
    perform
  )(FileListPublished)
);
