import { connect } from 'react-redux';
import { selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import { doHideModal } from 'redux/actions/app';
import { doCommentModBlock, doCommentModBlockAsAdmin, doCommentModBlockAsModerator } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { selectModerationDelegatorsById } from 'redux/selectors/comments';

import ModalBlockChannel from './view';

const select = (state, props) => {
  const contentClaim = selectClaimForUri(state, props.contentUri);
  return {
    activeChannelClaim: selectActiveChannelClaim(state),
    contentClaim,
    contentClaimIsMine: selectClaimIsMine(state, contentClaim),
    moderationDelegatorsById: selectModerationDelegatorsById(state),
  };
};

const perform = {
  doHideModal,
  doCommentModBlock,
  doCommentModBlockAsAdmin,
  doCommentModBlockAsModerator,
};

export default connect(select, perform)(ModalBlockChannel);
