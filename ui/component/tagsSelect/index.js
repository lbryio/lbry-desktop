import { connect } from 'react-redux';
import { selectUnfollowedTags, selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop, doAddTag, doDeleteTag } from 'redux/actions/tags';
import DiscoveryFirstRun from './view';

const select = (state, props) => ({
  unfollowedTags: selectUnfollowedTags(state),
  followedTags: selectFollowedTags(state),
});

export default connect(select, {
  doToggleTagFollowDesktop,
  doAddTag,
  doDeleteTag,
})(DiscoveryFirstRun);
