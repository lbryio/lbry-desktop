import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams, selectFetchingActiveLivestreams } from 'redux/selectors/livestream';
import { selectFollowedTags } from 'redux/selectors/tags';
import { selectUserVerifiedEmail, selectOdyseeMembershipIsPremiumPlus } from 'redux/selectors/user';
import { selectSubscriptions } from 'redux/selectors/subscriptions';
import { selectShowMatureContent, selectHomepageData, selectClientSetting } from 'redux/selectors/settings';

import DiscoverPage from './view';

const select = (state) => ({
  followedTags: selectFollowedTags(state),
  subscribedChannels: selectSubscriptions(state),
  authenticated: selectUserVerifiedEmail(state),
  showNsfw: selectShowMatureContent(state),
  homepageData: selectHomepageData(state),
  activeLivestreams: selectActiveLivestreams(state),
  fetchingActiveLivestreams: selectFetchingActiveLivestreams(state),
  hideScheduledLivestreams: selectClientSetting(state, SETTINGS.HIDE_SCHEDULED_LIVESTREAMS),
  userHasPremiumPlus: selectOdyseeMembershipIsPremiumPlus(state),
});

const perform = (dispatch) => ({
  doFetchActiveLivestreams: () => dispatch(doFetchActiveLivestreams()),
});

export default connect(select, perform)(DiscoverPage);
