//@ts-nocheck
import {connect} from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import UserTagFollowIntro from './view';

const select = state: unknown => ({
  followedTags: selectFollowedTags(state),
});

export default connect(select)(UserTagFollowIntro);
