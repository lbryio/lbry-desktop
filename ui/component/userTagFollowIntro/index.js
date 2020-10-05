import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import UserTagFollowIntro from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
});

export default connect(select)(UserTagFollowIntro);
