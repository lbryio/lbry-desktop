import { connect } from 'react-redux';
import { doChannelSubscribe } from 'redux/actions/subscriptions';
import { selectHomepageData, selectLanguage } from 'redux/selectors/settings';
import { selectPrefsReady } from 'redux/selectors/sync';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import UserChannelFollowIntro from './view';

const select = (state) => ({
  homepageData: selectHomepageData(state),
  language: selectLanguage(state),
  prefsReady: selectPrefsReady(state),
  subscribedChannels: selectSubscriptions(state),
});

const perform = (dispatch) => ({
  channelSubscribe: (channelName, uri) => dispatch(doChannelSubscribe({ channelName, uri })),
});

export default connect(select, perform)(UserChannelFollowIntro);
