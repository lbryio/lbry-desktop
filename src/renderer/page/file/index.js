import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { doFetchFileInfo } from 'redux/actions/file_info';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import { selectRewardContentClaimIds, selectPlayingUri } from 'redux/selectors/content';
import { doFetchCostInfoForUri } from 'redux/actions/cost_info';
import { doCheckSubscription } from 'redux/actions/subscriptions';
import {
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
  makeSelectClaimIsMine,
} from 'redux/selectors/claims';
import { makeSelectCostInfoForUri } from 'redux/selectors/cost_info';
import { selectShowNsfw } from 'redux/selectors/settings';
import { selectMediaPaused } from 'redux/selectors/media';
import { doOpenModal } from 'redux/actions/app';
import FilePage from './view';
import { makeSelectCurrentParam } from 'redux/selectors/navigation';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { doPrepareEdit } from 'redux/actions/publish';

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
  isPaused: selectMediaPaused(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  fetchFileInfo: uri => dispatch(doFetchFileInfo(uri)),
  fetchCostInfo: uri => dispatch(doFetchCostInfoForUri(uri)),
  checkSubscription: subscription => dispatch(doCheckSubscription(subscription)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  prepareEdit: publishData => dispatch(doPrepareEdit(publishData)),
});

export default connect(select, perform)(FilePage);
