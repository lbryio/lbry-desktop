import { connect } from 'react-redux';
import {
  doFetchFileInfo,
  doFetchCostInfoForUri,
  makeSelectCurrentParam,
  makeSelectCostInfoForUri,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectRewardContentClaimIds } from 'redux/selectors/content';
import { selectShowNsfw } from 'redux/selectors/settings';
import FilePage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  tab: makeSelectCurrentParam('tab')(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
});

export default connect(select, perform)(FilePage);
