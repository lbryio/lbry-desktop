import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doFetchFileInfo } from 'redux/actions/file_info';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { selectRewardContentClaimIds } from 'redux/selectors/content';
import { doFetchCostInfoForUri } from 'redux/actions/cost_info';
import { checkSubscriptionLatest } from 'redux/actions/subscriptions';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from 'redux/selectors/claims';
import { makeSelectCostInfoForUri } from 'redux/selectors/cost_info';
import { selectShowNsfw } from 'redux/selectors/settings';
import FilePage from './view';
import { makeSelectCurrentParam } from 'redux/selectors/navigation';

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
  checkSubscriptionLatest: (subscription, uri) =>
    dispatch(checkSubscriptionLatest(subscription, uri)),
});

export default connect(select, perform)(FilePage);
