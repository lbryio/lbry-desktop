import { connect } from 'react-redux';
import { SETTINGS } from 'lbry-redux';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import ChannelsFollowingPage from './view';

const select = state => ({
  subscribedChannels: selectSubscriptions(state),
  tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
});

export default connect(select)(ChannelsFollowingPage);
