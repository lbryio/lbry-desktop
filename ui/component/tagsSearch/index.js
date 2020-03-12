import { connect } from 'react-redux';
import { selectUnfollowedTags, selectFollowedTags, doReplaceTags, doAddTag, doDeleteTag } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import DiscoveryFirstRun from './view';

const select = (state, props) => ({
  unfollowedTags: selectUnfollowedTags(state),
  followedTags: selectFollowedTags(state),
});

export default connect(
  select,
  {
    doToggleTagFollowDesktop,
    doAddTag,
    doDeleteTag,
    doReplaceTags,
  }
)(DiscoveryFirstRun);
