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
  selectMyChannelClaims,
  makeSelectClaimIsStreamPlaceholder,
  makeSelectPublishFormValue,
} from 'lbry-redux';
import * as RENDER_MODES from 'constants/file_render_modes';
import { doPublishDesktop } from 'redux/actions/publish';
import { selectUnclaimedRewardValue } from 'redux/selectors/rewards';
import {
  selectModal,
  selectActiveChannelClaim,
  selectIncognito,
  selectActiveChannelStakedLevel,
} from 'redux/selectors/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import PublishPage from './view';
import { selectUser } from 'redux/selectors/user';

const select = (state) => {
  const myClaimForUri = selectMyClaimForUri(state);
  const permanentUrl = (myClaimForUri && myClaimForUri.permanent_url) || '';
  const isPostClaim = makeSelectFileRenderModeForUri(permanentUrl)(state) === RENDER_MODES.MARKDOWN;

  return {
    ...selectPublishFormValues(state),
    user: selectUser(state),
    // The winning claim for a short lbry uri
    amountNeededForTakeover: selectTakeOverAmount(state),
    isLivestreamClaim: makeSelectClaimIsStreamPlaceholder(permanentUrl)(state),
    isPostClaim,
    permanentUrl,
    // My previously published claims under this short lbry uri
    myClaimForUri,
    // If I clicked the "edit" button, have I changed the uri?
    // Need this to make it easier to find the source on previously published content
    isStillEditing: selectIsStillEditing(state),
    filePath: makeSelectPublishFormValue('filePath')(state),
    remoteUrl: makeSelectPublishFormValue('remoteFileUrl')(state),
    isResolvingUri: selectIsResolvingPublishUris(state),
    totalRewardValue: selectUnclaimedRewardValue(state),
    modal: selectModal(state),
    enablePublishPreview: makeSelectClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW)(state),
    activeChannelClaim: selectActiveChannelClaim(state),
    myChannels: selectMyChannelClaims(state),
    incognito: selectIncognito(state),
    activeChannelStakedLevel: selectActiveChannelStakedLevel(state),
  };
};

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
  clearPublish: () => dispatch(doClearPublish()),
  resolveUri: (uri) => dispatch(doResolveUri(uri)),
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  prepareEdit: (claim, uri) => dispatch(doPrepareEdit(claim, uri)),
  resetThumbnailStatus: () => dispatch(doResetThumbnailStatus()),
  checkAvailability: (name) => dispatch(doCheckPublishNameAvailability(name)),
});

export default connect(select, perform)(PublishPage);
