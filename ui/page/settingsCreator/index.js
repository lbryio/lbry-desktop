import { connect } from 'react-redux';
import SettingsCreatorPage from './view';
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
import { doToast } from 'redux/actions/notifications';

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
  fetchCreatorSettings: (channelClaimIds) => dispatch(doFetchCreatorSettings(channelClaimIds)),
  updateCreatorSettings: (channelClaim, settings) => dispatch(doUpdateCreatorSettings(channelClaim, settings)),
  commentModAddDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModAddDelegate(modChanId, modChanName, creatorChannelClaim)),
  commentModRemoveDelegate: (modChanId, modChanName, creatorChannelClaim) =>
    dispatch(doCommentModRemoveDelegate(modChanId, modChanName, creatorChannelClaim)),
  commentModListDelegates: (creatorChannelClaim) => dispatch(doCommentModListDelegates(creatorChannelClaim)),
  doToast: (options) => dispatch(doToast(options)),
});

export default connect(select, perform)(SettingsCreatorPage);
