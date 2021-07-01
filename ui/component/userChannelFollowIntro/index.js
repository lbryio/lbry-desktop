import { connect } from 'react-redux';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import UserChannelFollowIntro from './view';
import { selectHomepageData } from 'redux/selectors/settings';
import { selectPrefsReady } from 'redux/selectors/sync';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  homepageData: selectHomepageData(state),
  prefsReady: selectPrefsReady(state),
});

const perform = (dispatch) => ({
  channelSubscribe: (uri) => dispatch(doChannelSubscribe(uri)),
});

export default connect(select, perform)(UserChannelFollowIntro);
