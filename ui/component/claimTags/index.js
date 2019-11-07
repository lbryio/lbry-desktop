import { connect } from 'react-redux';
import { makeSelectTagsForUri, selectFollowedTags } from 'lbry-redux';
import ClaimTags from './view';

const select = (state, props) => ({
  tags: makeSelectTagsForUri(props.uri)(state),
  followedTags: selectFollowedTags(state),
});

export default connect(
  select,
  null
)(ClaimTags);
