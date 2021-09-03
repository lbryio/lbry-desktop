import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { doHideModal } from 'redux/actions/app';
import { doCommentModBlock, doCommentModBlockAsAdmin, doCommentModBlockAsModerator } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectModerationDelegatorsById } from 'redux/selectors/comments';

import ModalBlockChannel from './view';

const select = (state, props) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  contentClaim: makeSelectClaimForUri(props.contentUri)(state),
  moderationDelegatorsById: selectModerationDelegatorsById(state),
});

const perform = (dispatch) => ({
  closeModal: () => dispatch(doHideModal()),
  commentModBlock: (commenterUri, timeoutHours) => dispatch(doCommentModBlock(commenterUri, timeoutHours)),
  commentModBlockAsAdmin: (commenterUri, blockerId, timeoutHours) =>
    dispatch(doCommentModBlockAsAdmin(commenterUri, blockerId, timeoutHours)),
  commentModBlockAsModerator: (commenterUri, creatorId, blockerId, timeoutHours) =>
    dispatch(doCommentModBlockAsModerator(commenterUri, creatorId, blockerId, timeoutHours)),
});

export default connect(select, perform)(ModalBlockChannel);
