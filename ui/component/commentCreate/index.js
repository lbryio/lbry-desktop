import { connect } from 'react-redux';
import {
  makeSelectClaimForUri,
  makeSelectClaimIsMine,
  selectMyChannelClaims,
  selectFetchingMyChannels,
  doSendTip,
} from 'lbry-redux';
import { doOpenModal, doSetActiveChannel } from 'redux/actions/app';
import { doCommentCreate } from 'redux/actions/comments';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { makeSelectCommentsDisabledForUri } from 'redux/selectors/comments';
import { CommentCreate } from './view';

const select = (state, props) => ({
  commentingEnabled: IS_WEB ? Boolean(selectUserVerifiedEmail(state)) : true,
  commentsDisabledBySettings: makeSelectCommentsDisabledForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
  channels: selectMyChannelClaims(state),
  isFetchingChannels: selectFetchingMyChannels(state),
  activeChannelClaim: selectActiveChannelClaim(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
});

const perform = (dispatch, ownProps) => ({
  createComment: (comment, claimId, parentId, txid, payment_intent_id, environment) =>
    dispatch(doCommentCreate(comment, claimId, parentId, ownProps.uri, ownProps.livestream, txid, payment_intent_id, environment)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  setActiveChannel: (claimId) => dispatch(doSetActiveChannel(claimId)),
  sendTip: (params, callback, errorCallback) => dispatch(doSendTip(params, false, callback, errorCallback, false)),
});

export default connect(select, perform)(CommentCreate);
