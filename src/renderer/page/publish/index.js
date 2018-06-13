import { connect } from 'react-redux';
import { doResolveUri, selectClaimsByUri, selectResolvingUris, selectBalance } from 'lbry-redux';
import { doNavigate } from 'redux/actions/navigation';
import {
  selectPublishFormValues,
  selectIsStillEditing,
  selectMyClaimForUri,
} from 'redux/selectors/publish';
import {
  doResetThumbnailStatus,
  doClearPublish,
  doUpdatePublishForm,
  doPublish,
  doPrepareEdit,
} from 'redux/actions/publish';
import PublishPage from './view';

const select = state => {
  const isStillEditing = selectIsStillEditing(state);
  const myClaimForUri = selectMyClaimForUri(state);
  const publishState = selectPublishFormValues(state);
  const { uri } = publishState;

  const resolvingUris = selectResolvingUris(state);
  let isResolvingUri = false;
  if (uri) {
    isResolvingUri = resolvingUris.includes(uri);
  }

  let claimForUri;
  let winningBidForClaimUri;
  if (!myClaimForUri) {
    // if the uri isn't from a users claim, find the winning bid needed for the vanity url
    // in the future we may want to display this on users claims
    // ex: "you own this, for 5 more lbc you will win this claim"
    const claimsByUri = selectClaimsByUri(state);
    claimForUri = claimsByUri[uri];
    winningBidForClaimUri = claimForUri ? claimForUri.effective_amount : null;
  }

  return {
    ...publishState,
    isResolvingUri,
    // The winning claim for a short lbry uri
    claimForUri,
    winningBidForClaimUri,
    // My previously published claims under this short lbry uri
    myClaimForUri,
    // If I clicked the "edit" button, have I changed the uri?
    // Need this to make it easier to find the source on previously published content
    isStillEditing,
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
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
});

export default connect(
  select,
  perform
)(PublishPage);
