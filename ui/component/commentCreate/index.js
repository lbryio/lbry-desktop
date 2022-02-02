import { connect } from 'react-redux';
import {
  selectClaimForUri,
  selectClaimIsMine,
  selectHasChannels,
  selectFetchingMyChannels,
  makeSelectTagInClaimOrChannelForUri,
} from 'redux/selectors/claims';
import { CommentCreate } from './view';
import { DISABLE_SUPPORT_TAG } from 'constants/tags';
import { doCommentCreate, doFetchCreatorSettings, doCommentById } from 'redux/actions/comments';
import { doSendTip, doSendCashTip } from 'redux/actions/wallet';
import { doToast } from 'redux/actions/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectSettingsByChannelId } from 'redux/selectors/comments';
import { doOpenModal } from 'redux/actions/app';

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
  createComment: (comment, claimId, parentId, txid, payment_intent_id, environment, sticker) =>
    dispatch(
      doCommentCreate(
        comment,
        claimId,
        parentId,
        ownProps.uri,
        ownProps.isLivestream,
        txid,
        payment_intent_id,
        environment,
        sticker
      )
    ),
  doFetchCreatorSettings: (channelClaimId) => dispatch(doFetchCreatorSettings(channelClaimId)),
  doToast: (options) => dispatch(doToast(options)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId, false)),
  sendCashTip: (tipParams, userParams, claimId, environment, successCallback) =>
    dispatch(doSendCashTip(tipParams, false, userParams, claimId, environment, successCallback)),
  sendTip: (params, callback, errorCallback) => dispatch(doSendTip(params, false, callback, errorCallback, false)),
  doOpenModal: (id, params) => dispatch(doOpenModal(id, params)),
});

export default connect(select, perform)(CommentCreate);
