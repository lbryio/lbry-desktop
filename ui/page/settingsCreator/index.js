import { connect } from 'react-redux';
import SettingsCreatorPage from './view';
import { doOpenModal } from 'redux/actions/app';
import {
  doCommentBlockWords,
  doCommentUnblockWords,
  doCommentModAddDelegate,
  doCommentModRemoveDelegate,
  doCommentModListDelegates,
  doFetchCreatorSettings,
  doUpdateCreatorSettings,
} from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  selectSettingsByChannelId,
  selectFetchingCreatorSettings,
  selectFetchingBlockedWords,
  selectModerationDelegatesById,
  selectMembersOnlyCommentsForChannelId,
} from 'redux/selectors/comments';
import { selectChannelHasMembershipTiersForId } from 'redux/selectors/memberships';
import { doListAllMyMembershipTiers } from 'redux/actions/memberships';
import { selectMyChannelClaims } from 'redux/selectors/claims';

const select = (state, props) => {
  const activeChannelClaim = selectActiveChannelClaim(state);
  const activeChannelId = activeChannelClaim?.claim_id;

  return {
    activeChannelClaim: selectActiveChannelClaim(state),
    channelHasMembershipTiers: selectChannelHasMembershipTiersForId(state, activeChannelId),
    fetchingBlockedWords: selectFetchingBlockedWords(state),
    fetchingCreatorSettings: selectFetchingCreatorSettings(state),
    moderationDelegatesById: selectModerationDelegatesById(state),
    myChannelClaims: selectMyChannelClaims(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    areCommentsMembersOnly: selectMembersOnlyCommentsForChannelId(state, activeChannelId),
  };
};

const perform = (dispatch) => ({
  commentBlockWords: (channelClaim, words) => dispatch(doCommentBlockWords(channelClaim, words)),
  commentUnblockWords: (channelClaim, words) => dispatch(doCommentUnblockWords(channelClaim, words)),
  fetchCreatorSettings: (channelClaimId) => dispatch(doFetchCreatorSettings(channelClaimId)),
  updateCreatorSettings: (channelClaim, settings) => dispatch(doUpdateCreatorSettings(channelClaim, settings)),
  commentModAddDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModAddDelegate(modChanId, modChanName, creatorChannelClaim)),
  commentModRemoveDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModRemoveDelegate(modChanId, modChanName, creatorChannelClaim)),
  commentModListDelegates: (creatorChannelClaim) => dispatch(doCommentModListDelegates(creatorChannelClaim)),
  doOpenModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  listAllMyMembershipTiers: (channelId) => dispatch(doListAllMyMembershipTiers()),
});

export default connect(select, perform)(SettingsCreatorPage);
