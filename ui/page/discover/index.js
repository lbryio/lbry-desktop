import { connect } from 'react-redux';
import { selectFollowedTags } from 'lbry-redux';
import { doToggleTagFollowDesktop } from 'redux/actions/tags';
import Tags from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
});

export default connect(
  select,
  {
    doToggleTagFollowDesktop,
  }
)(Tags);
