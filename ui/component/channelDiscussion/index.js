import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { DISABLE_COMMENTS_TAG } from 'constants/tags';
import ChannelDiscussion from './view';
import { makeSelectTagInClaimOrChannelForUri } from 'redux/selectors/claims';

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);

  return {
    linkedCommentId: urlParams.get('lc'),
    commentsDisabled: makeSelectTagInClaimOrChannelForUri(props.uri, DISABLE_COMMENTS_TAG)(state),
  };
};

export default withRouter(connect(select)(ChannelDiscussion));
