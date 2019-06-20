import { connect } from 'react-redux';
import { selectFollowedTags, doToggleTagFollow } from 'lbry-redux';
import Tags from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
});

export default connect(
  select,
  {
    doToggleTagFollow,
  }
)(Tags);
