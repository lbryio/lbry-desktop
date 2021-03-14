import { connect } from 'react-redux';
import { doCommentModUnBlock, doCommentModBlock } from 'redux/actions/comments';
import { makeSelectChannelIsBlocked, makeSelectUriIsBlockingOrUnBlocking } from 'redux/selectors/comments';
import ChannelBlockButton from './view';

const select = (state, props) => ({
  isBlocked: makeSelectChannelIsBlocked(props.uri)(state),
  isBlockingOrUnBlocking: makeSelectUriIsBlockingOrUnBlocking(props.uri)(state),
});

export default connect(select, {
  doCommentModUnBlock,
  doCommentModBlock,
})(ChannelBlockButton);
