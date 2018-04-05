import { connect } from 'react-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectRewardContentClaimIds, selectPlayingUri } from 'redux/selectors/content';
import { doCheckSubscription } from 'redux/actions/subscriptions';
import {
  doFetchFileInfo,
  doFetchCostInfoForUri,
  makeSelectClaimIsMine,
  makeSelectCostInfoForUri,
  makeSelectFileInfoForUri,
  makeSelectClaimForUri,
  makeSelectContentTypeForUri,
  makeSelectMetadataForUri,
} from 'lbry-redux';
import { selectShowNsfw } from 'redux/selectors/settings';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectMediaPaused } from 'redux/selectors/media';
import { doOpenModal } from 'redux/actions/app';
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
