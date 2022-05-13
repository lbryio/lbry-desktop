import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasNavigated, selectScrollStartingPosition } from 'redux/selectors/app';
import { selectClientSetting, selectHomepageData, selectWildWestDisabled } from 'redux/selectors/settings';
import Router from './view';
import { selectTitleForUri } from 'redux/selectors/claims';
import { doSetHasNavigated, doSetActiveChannel } from 'redux/actions/app';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';

const select = (state, props) => {
  const { uri } = props;

  return {
    uri,
    title: selectTitleForUri(state, uri),
    currentScroll: selectScrollStartingPosition(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    hasNavigated: selectHasNavigated(state),
    hasUnclaimedRefereeReward: selectHasUnclaimedRefereeReward(state),
    homepageData: selectHomepageData(state),
    wildWestDisabled: selectWildWestDisabled(state),
    unseenCount: selectUnseenNotificationCount(state),
    hideTitleNotificationCount: selectClientSetting(state, SETTINGS.HIDE_TITLE_NOTIFICATION_COUNT),
    hasDefaultChannel: Boolean(selectClientSetting(state, SETTINGS.ACTIVE_CHANNEL_CLAIM)),
  };
};

const perform = {
  setHasNavigated: doSetHasNavigated,
  setReferrer: doUserSetReferrer,
  doSetActiveChannel,
};

export default connect(select, perform)(Router);
