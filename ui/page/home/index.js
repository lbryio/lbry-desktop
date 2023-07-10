import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectShowMatureContent, selectHomepageData } from 'redux/selectors/settings';

import DiscoverPage from './view';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  showNsfw: selectShowMatureContent(state),
  homepageData: selectHomepageData(state),
});

export default connect(select)(DiscoverPage);
