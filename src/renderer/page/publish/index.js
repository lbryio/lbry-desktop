import { connect } from 'react-redux';
import { doClaimRewardType } from 'redux/actions/rewards';
import {
  doHistoryBack,
  doResolveUri,
  makeSelectCostInfoForUri,
  selectMyClaims,
  selectFetchingMyChannels,
  selectMyChannelClaims,
  selectClaimsByUri,
  selectResolvingUris,
  selectBalance,
} from 'lbry-redux';
import {
  doFetchClaimListMine,
  doFetchChannelListMine,
  doCreateChannel,
} from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import rewards from 'rewards';
import { selectPublishFormValues } from 'redux/selectors/publish';
import { doClearPublish, doUpdatePublishForm, doPublish } from 'redux/actions/publish';
import { doPrepareEdit } from 'redux/actions/publish';
import PublishPage from './view';

const select = (state, props) => {
  const publishState = selectPublishFormValues(state);
  const { uri, name } = publishState;

  const resolvingUris = selectResolvingUris(state);
  let isResolvingUri = false;
  if (uri) {
    isResolvingUri = resolvingUris.includes(uri);
  }

  const claimsByUri = selectClaimsByUri(state);
  const myClaims = selectMyClaims(state);

  const claimForUri = claimsByUri[uri];
  let winningBidForClaimUri;
  let myClaimForUri;
  if (claimForUri) {
    winningBidForClaimUri = claimForUri.effective_amount;
    myClaimForUri = myClaims.find(claim => claim.name === name);
  }

  return {
    ...publishState,
    isResolvingUri,
    claimForUri,
    winningBidForClaimUri,
    myClaimForUri,
    costInfo: makeSelectCostInfoForUri(props.uri)(state),
    balance: selectBalance(state),
  };
};

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  publish: params => dispatch(doPublish(params)),
  navigate: path => dispatch(doNavigate(path)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
});

export default connect(select, perform)(PublishPage);
