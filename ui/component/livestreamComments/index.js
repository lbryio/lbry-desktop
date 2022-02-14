import { connect } from 'react-redux';
import { selectIsFetchingComments } from 'redux/selectors/comments';
import { selectIsUriResolving } from 'redux/selectors/claims';
import { VIEW_MODES } from 'ui/component/livestreamChatLayout/view';
import LivestreamComments from './view';

const select = (state, props) => {
  const { comments, viewMode } = props;

  return {
    fetchingComments: selectIsFetchingComments(state),
    resolvingSuperchats: Boolean(
      viewMode === VIEW_MODES.SUPERCHAT &&
        comments &&
        comments.some(({ channel_url }) => selectIsUriResolving(state, channel_url))
    ),
  };
};

export default connect(select)(LivestreamComments);
