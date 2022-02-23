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
} from 'redux/selectors/comments';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  settingsByChannelId: selectSettingsByChannelId(state),
  fetchingCreatorSettings: selectFetchingCreatorSettings(state),
  fetchingBlockedWords: selectFetchingBlockedWords(state),
  moderationDelegatesById: selectModerationDelegatesById(state),
});

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
});

export default connect(select, perform)(SettingsCreatorPage);
