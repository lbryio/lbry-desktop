import { connect } from 'react-redux';
import { selectClaimIdForUri } from 'redux/selectors/claims';
import { selectViewersForId } from 'redux/selectors/livestream';
import { doFetchViewCount, selectViewCountForUri } from 'lbryinc';
import { doAnalyticsView } from 'redux/actions/app';
import FileViewCount from './view';

const select = (state, props) => {
  const claimId = selectClaimIdForUri(state, props.uri);
  return {
    claimId,
    viewCount: selectViewCountForUri(state, props.uri),
    activeViewers: props.livestream && claimId ? selectViewersForId(state, claimId) : undefined,
  };
};

const perform = (dispatch) => ({
  fetchViewCount: (claimId) => dispatch(doFetchViewCount(claimId)),
  doAnalyticsView: (uri) => dispatch(doAnalyticsView(uri)),
});

export default connect(select, perform)(FileViewCount);
