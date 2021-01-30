import { connect } from 'react-redux';
import {
  doResolveUri,
  selectPublishFormValues,
  selectIsStillEditing,
  selectMyClaimForUri,
  selectIsResolvingPublishUris,
  selectTakeOverAmount,
  doResetThumbnailStatus,
  doClearPublish,
  doUpdatePublishForm,
  doPrepareEdit,
  doCheckPublishNameAvailability,
  SETTINGS,
} from 'lbry-redux';
import { doPublishDesktop } from 'redux/actions/publish';
import { selectUnclaimedRewardValue } from 'redux/selectors/rewards';
import { selectModal } from 'redux/selectors/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import PublishPage from './view';

const select = state => ({
  ...selectPublishFormValues(state),
  // The winning claim for a short lbry uri
  amountNeededForTakeover: selectTakeOverAmount(state),
  // My previously published claims under this short lbry uri
  myClaimForUri: selectMyClaimForUri(state),
  // If I clicked the "edit" button, have I changed the uri?
  // Need this to make it easier to find the source on previously published content
  isStillEditing: selectIsStillEditing(state),
  isResolvingUri: selectIsResolvingPublishUris(state),
  totalRewardValue: selectUnclaimedRewardValue(state),
  modal: selectModal(state),
  enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: uri => dispatch(doResolveUri(uri)),
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
  checkAvailability: name => dispatch(doCheckPublishNameAvailability(name)),
});

export default connect(select, perform)(PublishPage);
