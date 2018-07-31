import { connect } from 'react-redux';
import * as settings from 'constants/settings';
import { doNavigate } from 'redux/actions/navigation';
import { selectRewardContentClaimIds, selectPlayingUri } from 'redux/selectors/content';
import { doCheckSubscription } from 'redux/actions/subscriptions';
import { doSetClientSetting } from 'redux/actions/settings';
import { doSetContentHistoryItem } from 'redux/actions/content';
import {
  doFetchFileInfo,
  doFetchCostInfoForUri,
  makeSelectClaimIsMine,
  makeSelectCostInfoForUri,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  doNotify,
} from 'lbry-redux';
import { selectShowNsfw, makeSelectClientSetting } from 'redux/selectors/settings';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { doPrepareEdit } from 'redux/actions/publish';
import FilePage from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  contentType: makeSelectContentTypeForUri(props.uri)(state),
  costInfo: makeSelectCostInfoForUri(props.uri)(state),
  metadata: makeSelectMetadataForUri(props.uri)(state),
  obscureNsfw: !selectShowNsfw(state),
  fileInfo: makeSelectFileInfoForUri(props.uri)(state),
  rewardedContentClaimIds: selectRewardContentClaimIds(state, props),
  subscriptions: selectSubscriptions(state),
  playingUri: selectPlayingUri(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  checkSubscription: uri => dispatch(doCheckSubscription(uri)),
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
  prepareEdit: (publishData, uri) => dispatch(doPrepareEdit(publishData, uri)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  setViewed: uri => dispatch(doSetContentHistoryItem(uri)),
});

export default connect(
  select,
  perform
)(FilePage);
