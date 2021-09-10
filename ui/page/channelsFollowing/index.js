import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams } from 'redux/selectors/livestream';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import ChannelsFollowingPage from './view';

const select = (state) => ({
  subscribedChannels: selectSubscriptions(state),
  tileLayout: makeSelectClientSetting(SETTINGS.TILE_LAYOUT)(state),
  activeLivestreams: selectActiveLivestreams(state),
});

export default connect(select, {
  doFetchActiveLivestreams,
})(ChannelsFollowingPage);
