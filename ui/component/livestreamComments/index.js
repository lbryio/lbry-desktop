import { connect } from 'react-redux';
import { selectIsFetchingComments } from 'redux/selectors/comments';
import LivestreamComments from './view';

const select = (state) => ({
  fetchingComments: selectIsFetchingComments(state),
});

export default connect(select)(LivestreamComments);
