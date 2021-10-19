import { connect } from 'react-redux';
import { makeSelectTagsForUri } from 'redux/selectors/claims';
import { selectFollowedTags } from 'redux/selectors/tags';
import ClaimTags from './view';

const select = (state, props) => ({
  tags: makeSelectTagsForUri(props.uri)(state),
  followedTags: selectFollowedTags(state),
});

export default connect(select, null)(ClaimTags);
