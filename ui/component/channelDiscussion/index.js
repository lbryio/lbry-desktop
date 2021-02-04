import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { makeSelectCommentForCommentId } from 'redux/selectors/comments';

import ChannelDiscussion from './view';
import { makeSelectTagsForUri } from 'lbry-redux';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const linkedCommentId = urlParams.get('lc');

  return {
    linkedComment: makeSelectCommentForCommentId(linkedCommentId)(state),
    tags: makeSelectTagsForUri(props.uri)(state),
  };
};

export default withRouter(connect(select)(ChannelDiscussion));
