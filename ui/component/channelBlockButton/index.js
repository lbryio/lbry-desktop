import { connect } from 'react-redux';
import { selectClaimIdForUri } from 'redux/selectors/claims';
import {
  doCommentModUnBlock,
  doCommentModBlock,
  doCommentModBlockAsAdmin,
  doCommentModUnBlockAsAdmin,
  doCommentModUnBlockAsModerator,
  doCommentModBlockAsModerator,
} from 'redux/actions/comments';
import {
  makeSelectChannelIsBlocked,
  makeSelectChannelIsAdminBlocked,
  makeSelectChannelIsModeratorBlockedForCreator,
  makeSelectUriIsBlockingOrUnBlocking,
  makeSelectIsTogglingForDelegator,
} from 'redux/selectors/comments';

import { BLOCK_LEVEL } from 'constants/comment';
import ChannelBlockButton from './view';

const select = (state, props) => {
  let isBlocked;
  let isToggling;

  switch (props.blockLevel) {
    default:
    case BLOCK_LEVEL.SELF:
      isBlocked = makeSelectChannelIsBlocked(props.uri)(state);
      break;

    case BLOCK_LEVEL.MODERATOR:
      isBlocked = makeSelectChannelIsModeratorBlockedForCreator(props.uri, props.creatorUri)(state);
      isToggling = makeSelectIsTogglingForDelegator(props.uri, props.creatorUri)(state);
      break;

    case BLOCK_LEVEL.ADMIN:
      isBlocked = makeSelectChannelIsAdminBlocked(props.uri)(state);
      break;
  }

  return {
    isBlocked,
    isToggling,
    isBlockingOrUnBlocking: makeSelectUriIsBlockingOrUnBlocking(props.uri)(state),
    creatorId: selectClaimIdForUri(state, props.creatorUri),
  };
};

export default connect(select, {
  doCommentModUnBlock,
  doCommentModBlock,
  doCommentModUnBlockAsAdmin,
  doCommentModBlockAsAdmin,
  doCommentModUnBlockAsModerator,
  doCommentModBlockAsModerator,
})(ChannelBlockButton);
