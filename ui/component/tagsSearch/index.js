import { connect } from 'react-redux';
import { selectUnfollowedTags, selectFollowedTags } from 'redux/selectors/tags';
import { doToggleTagFollowDesktop, doAddTag, doDeleteTag } from 'redux/actions/tags';
import { selectUser } from 'redux/selectors/user';
import DiscoveryFirstRun from './view';

const select = state => ({
  unfollowedTags: selectUnfollowedTags(state),
  followedTags: selectFollowedTags(state),
  user: selectUser(state),
});

export default connect(select, {
  doToggleTagFollowDesktop,
  doAddTag,
  doDeleteTag,
})(DiscoveryFirstRun);
