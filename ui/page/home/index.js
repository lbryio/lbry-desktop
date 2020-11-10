import * as SETTINGS from 'constants/settings';
import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { makeSelectClientSetting } from 'redux/selectors/settings';

import DiscoverPage from './view';

const select = state => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  authenticated: selectUserVerifiedEmail(state),
  showNsfw: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
});

const perform = {};

export default connect(select, perform)(DiscoverPage);
