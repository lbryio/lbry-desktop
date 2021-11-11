import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimIsMine,
  selectHasChannels,
  selectFetchingMyChannels,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { doSendTip } from 'redux/actions/wallet';
import { doCommentCreate, doFetchCreatorSettings, doCommentById } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectSettingsByChannelId } from 'redux/selectors/comments';
import { CommentCreate } from './view';
import { doToast } from 'redux/actions/notifications';
import { DISABLE_SUPPORT_TAG } from 'constants/tags';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);
  return {
    activeChannelClaim: selectActiveChannelClaim(state),
    hasChannels: selectHasChannels(state),
    claim,
    claimIsMine: selectClaimIsMine(state, claim),
    isFetchingChannels: selectFetchingMyChannels(state),
    settingsByChannelId: selectSettingsByChannelId(state),
    supportDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_SUPPORT_TAG)(state),
  };
};

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, parentId, txid, payment_intent_id, environment) =>
    dispatch(doCommentCreate(comment, claimId, parentId, ownProps.uri, txid, payment_intent_id, environment)),
  sendTip: (params, callback, errorCallback) => dispatch(doSendTip(params, false, callback, errorCallback, false)),
  doToast: (options) => dispatch(doToast(options)),
  doFetchCreatorSettings: (channelClaimId) => dispatch(doFetchCreatorSettings(channelClaimId)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId, false)),
});

export default connect(select, perform)(CommentCreate);
