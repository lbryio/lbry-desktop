import React from 'react';
import { connect } from 'react-redux';
import { doNavigate, doHistoryBack } from 'redux/actions/navigation';
import { doClaimRewardType } from 'redux/actions/rewards';
import {
  selectMyClaims,
  selectClaimsByUri,
  selectClaimById
} from 'redux/selectors/claims';
import { selectResolvingUris } from 'redux/selectors/content';
import { selectPublishFormValues } from 'redux/selectors/publish';
import {
  doResolveUri,
} from 'redux/actions/content';
import { selectBalance } from 'redux/selectors/wallet';
import { makeSelectFileInfoForUri } from 'redux/selectors/file_info';
import {
  doUpdateFilePath,
  doClearFilePath,
  doUpdateContentPricePref,
  doUpdateContentPrice,
  doUpdateContentDescriptors,
  doClearPublish,
  doToggleTos,
  doUpdatePublishForm,
  doPublish,
  doClearPublishError
} from 'redux/actions/publish';
import PublishPage from './view';

const select = (state, props) => {
  const publishState = selectPublishFormValues(state);
  const { uri, name } = publishState;
  const { params: { id } } = props;

  let prefillClaim;
  if (id) {
    prefillClaim = selectClaimById(id)(state);
  }

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

  let myFileInfoForUri;
  if (!!myClaimForUri) {
    myFileInfoForUri = makeSelectFileInfoForUri(uri)(state);
  }

  return {
    ...publishState,
    prefillClaim,
    isEditing: !!prefillClaim,
    isResolvingUri,
    claimForUri,
    winningBidForClaimUri,
    myClaimForUri,
    myFileInfoForUri,
    balance: selectBalance(state),
  }
};

const perform = dispatch => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  publish: (params) => dispatch(doPublish(params)),
  clearError: () => dispatch(doClearPublishError()),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(PublishPage);
