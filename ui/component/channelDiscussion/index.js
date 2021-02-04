import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { makeSelectCommentForCommentId } from 'redux/selectors/comments';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import ChannelDiscussion from './view';
import { makeSelectTagInClaimOrChannelForUri } from 'lbry-redux';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const linkedCommentId = urlParams.get('lc');

  return {
    linkedComment: makeSelectCommentForCommentId(linkedCommentId)(state),
    commentsDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
  };
};

export default withRouter(connect(select)(ChannelDiscussion));
