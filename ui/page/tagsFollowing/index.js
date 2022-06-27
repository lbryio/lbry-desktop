import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import DiscoverPage from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
});

const perform = {};

export default connect(select, perform)(DiscoverPage);
