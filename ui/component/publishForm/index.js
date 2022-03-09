import { connect } from 'react-redux';
import {
  doResetThumbnailStatus,
  doClearPublish,
  doUpdatePublishForm,
  doPrepareEdit,
  doPublishDesktop,
} from 'redux/actions/publish';
import { doResolveUri, doCheckPublishNameAvailability } from 'redux/actions/claims';
import {
  selectTakeOverAmount,
  selectPublishFormValues,
  selectIsStillEditing,
  makeSelectPublishFormValue,
  selectIsResolvingPublishUris,
  selectMyClaimForUri,
} from 'redux/selectors/publish';
import { selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import * as RENDER_MODES from 'constants/file_render_modes';
import * as SETTINGS from 'constants/settings';
import { doClaimInitialRewards } from 'redux/actions/rewards';
import {
  selectUnclaimedRewardValue,
  selectIsClaimingInitialRewards,
  selectHasClaimedInitialRewards,
} from 'redux/selectors/rewards';
import {
  selectModal,
  selectActiveChannelClaim,
  selectIncognito,
  selectActiveChannelStakedLevel,
} from 'redux/selectors/app';
import { selectClientSetting } from 'redux/selectors/settings';
import { makeSelectFileRenderModeForUri } from 'redux/selectors/content';
import { selectUser, selectOdyseeMembershipName } from 'redux/selectors/user';
import PublishForm from './view';

const select = (state) => {
  const myClaimForUri = selectMyClaimForUri(state);
  const permanentUrl = (myClaimForUri && myClaimForUri.permanent_url) || '';
  const isPostClaim = makeSelectFileRenderModeForUri(permanentUrl)(state) === RENDER_MODES.MARKDOWN;

  return {
    ...selectPublishFormValues(state),
    user: selectUser(state),
    // The winning claim for a short lbry uri
    amountNeededForTakeover: selectTakeOverAmount(state),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, permanentUrl),
    isPostClaim,
    permanentUrl,
    // My previously published claims under this short lbry uri
    myClaimForUri,
    // If I clicked the "edit" button, have I changed the uri?
    // Need this to make it easier to find the source on previously published content
    isStillEditing: selectIsStillEditing(state),
    filePath: makeSelectPublishFormValue('filePath')(state),
    remoteUrl: makeSelectPublishFormValue('remoteFileUrl')(state),
    publishSuccess: makeSelectPublishFormValue('publishSuccess')(state),
    isResolvingUri: selectIsResolvingPublishUris(state),
    totalRewardValue: selectUnclaimedRewardValue(state),
    modal: selectModal(state),
    enablePublishPreview: selectClientSetting(state, SETTINGS.ENABLE_PUBLISH_PREVIEW),
    activeChannelClaim: selectActiveChannelClaim(state),
    incognito: selectIncognito(state),
    activeChannelStakedLevel: selectActiveChannelStakedLevel(state),
    isClaimingInitialRewards: selectIsClaimingInitialRewards(state),
    hasClaimedInitialRewards: selectHasClaimedInitialRewards(state),
    odyseeMembership: selectOdyseeMembershipName(state),
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
  claimInitialRewards: () => dispatch(doClaimInitialRewards()),
});

export default connect(select, perform)(PublishForm);
