import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
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
  commentModBlock: (a, b) => dispatch(doCommentModBlock(a, b)),
  commentModBlockAsAdmin: (a, b, c) => dispatch(doCommentModBlockAsAdmin(a, b, c)),
  commentModBlockAsModerator: (a, b, c, d) => dispatch(doCommentModBlockAsModerator(a, b, c, d)),
});

export default connect(select, perform)(ModalBlockChannel);
