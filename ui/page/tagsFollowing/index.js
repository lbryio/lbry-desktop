import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import DiscoverPage from './view';
import { selectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  email: selectUserVerifiedEmail(state),
  tileLayout: selectClientSetting(state, SETTINGS.TILE_LAYOUT),
});

const perform = {};

export default connect(select, perform)(DiscoverPage);
