import { connect } from 'react-redux';
import { doHideModal } from 'redux/actions/app';
import ModalPublishPreview from './view';
import {
  selectMyMembershipTiersWithExclusiveContentPerk,
  selectMyMembershipTiersWithExclusiveLivestreamPerk,
  selectMembershipTiersForCreatorId,
} from 'redux/selectors/memberships';
import { selectPublishFormValue, selectPublishFormValues, selectIsStillEditing } from 'redux/selectors/publish';
import { selectMyChannelClaims, selectIsStreamPlaceholderForUri } from 'redux/selectors/claims';
import * as SETTINGS from 'constants/settings';
import { selectFfmpegStatus, selectClientSetting, selectLanguage } from 'redux/selectors/settings';
import { doPublishDesktop } from 'redux/actions/publish';
import { doSetClientSetting } from 'redux/actions/settings';

const select = (state, props) => {
  const editingUri = selectPublishFormValue(state, 'editingURI');
  const publishFormValues = selectPublishFormValues(state);
  const channelClaimId = publishFormValues.channelClaimId;

  return {
    ...publishFormValues,
    myChannels: selectMyChannelClaims(state),
    isVid: selectPublishFormValue(state, 'fileVid'),
    publishing: selectPublishFormValue(state, 'publishing'),
    remoteFile: selectPublishFormValue(state, 'remoteFileUrl'),
    tiersWithExclusiveContent: selectMyMembershipTiersWithExclusiveContentPerk(state, channelClaimId),
    tiersWithExclusiveLivestream: selectMyMembershipTiersWithExclusiveLivestreamPerk(state, channelClaimId),
    myMembershipTiers: selectMembershipTiersForCreatorId(state, channelClaimId),
    restrictingTiers: selectPublishFormValue(state, 'restrictedToMemberships'),
    isStillEditing: selectIsStillEditing(state),
    ffmpegStatus: selectFfmpegStatus(state),
    enablePublishPreview: selectClientSetting(state, SETTINGS.ENABLE_PUBLISH_PREVIEW),
    isLivestreamClaim: selectIsStreamPlaceholderForUri(state, editingUri),
    appLanguage: selectLanguage(state), // note: selectPublishFormValues contains 'language'
  };
};

const perform = (dispatch) => ({
  publish: (filePath, preview) => dispatch(doPublishDesktop(filePath, preview)),
  closeModal: () => dispatch(doHideModal()),
  setEnablePublishPreview: (value) => dispatch(doSetClientSetting(SETTINGS.ENABLE_PUBLISH_PREVIEW, value)),
});

export default connect(select, perform)(ModalPublishPreview);
