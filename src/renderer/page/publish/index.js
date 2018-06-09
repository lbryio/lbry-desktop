import { connect } from 'react-redux';
import {
  doResolveUri,
  makeSelectCostInfoForUri,
  selectMyClaims,
  selectClaimsByUri,
  selectResolvingUris,
  selectBalance,
} from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import { selectPublishFormValues } from 'redux/selectors/publish';
import {
  doResetThumbnailStatus,
  doClearPublish,
  doUpdatePublishForm,
  doPublish,
  doPrepareEdit,
} from 'redux/actions/publish';
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
  prepareEdit: claim => dispatch(doPrepareEdit(claim)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
});

export default connect(
  select,
  perform
)(PublishPage);
