import { connect } from 'react-redux';
import { selectClaimIdForUri } from 'redux/selectors/claims';
import { selectViewersForId } from 'redux/selectors/livestream';
import { selectLanguage } from 'redux/selectors/settings';
import { doFetchViewCount, selectViewCountForUri } from 'lbryinc';
import FileViewCount from './view';

const select = (state, props) => {
  const claimId = selectClaimIdForUri(state, props.uri);
  return {
    claimId,
    viewCount: selectViewCountForUri(state, props.uri),
    activeViewers: props.livestream && claimId ? selectViewersForId(state, claimId) : undefined,
    lang: selectLanguage(state),
  };
};

const perform = (dispatch) => ({
  fetchViewCount: (claimId) => dispatch(doFetchViewCount(claimId)),
});

export default connect(select, perform)(FileViewCount);
