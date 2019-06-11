import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import Tags from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
});

const perform = {};

export default connect(
  select,
  perform
)(Tags);
