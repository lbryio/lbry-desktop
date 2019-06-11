import { connect } from 'react-redux';
import {
  selectUnfollowedTags,
  selectFollowedTags,
  doReplaceTags,
  doToggleTagFollow,
  doAddTag,
  doDeleteTag,
} from 'lbry-redux';
import DiscoveryFirstRun from './view';

const select = (state, props) => ({
  unfollowedTags: selectUnfollowedTags(state),
  followedTags: selectFollowedTags(state),
});

export default connect(
  select,
  {
    doToggleTagFollow,
    doAddTag,
    doDeleteTag,
    doReplaceTags,
  }
)(DiscoveryFirstRun);
