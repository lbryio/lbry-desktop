import { connect } from 'react-redux';
import { selectTagsForUri } from 'redux/selectors/claims';
import { selectFollowedTags } from 'redux/selectors/tags';
import ClaimTags from './view';

const select = (state, props) => ({
  tags: selectTagsForUri(state, props.uri),
  followedTags: selectFollowedTags(state),
});

export default connect(select, null)(ClaimTags);
