import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectMyChannelClaims,
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

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  isFetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  settingsByChannelId: selectSettingsByChannelId(state),
  supportDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_SUPPORT_TAG)(state),
});

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, parentId, txid, payment_intent_id, environment) =>
    dispatch(
      doCommentCreate(
        comment,
        claimId,
        parentId,
        ownProps.uri,
        ownProps.livestream,
        txid,
        payment_intent_id,
        environment
      )
    ),
  sendTip: (params, callback, errorCallback) => dispatch(doSendTip(params, false, callback, errorCallback, false)),
  doToast: (options) => dispatch(doToast(options)),
  doFetchCreatorSettings: (channelClaimId) => dispatch(doFetchCreatorSettings(channelClaimId)),
  fetchComment: (commentId) => dispatch(doCommentById(commentId, false)),
});

export default connect(select, perform)(CommentCreate);
