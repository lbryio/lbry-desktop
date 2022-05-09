import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasNavigated, selectScrollStartingPosition } from 'redux/selectors/app';
import { selectClientSetting, selectHomepageData, selectWildWestDisabled } from 'redux/selectors/settings';
import Router from './view';
import { normalizeURI } from 'util/lbryURI';
import { selectTitleForUri } from 'redux/selectors/claims';
import { doSetHasNavigated } from 'redux/actions/app';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';
import { selectUnseenNotificationCount } from 'redux/selectors/notifications';

const select = (state) => {
  const { pathname, hash } = state.router.location;
  const urlPath = pathname + hash;
  // Remove the leading "/" added by the browser
  const path = urlPath.slice(1).replace(/:/g, '#');

  let uri;
  try {
    uri = normalizeURI(path);
  } catch (e) {
    const match = path.match(/[#/:]/);

    if (!path.startsWith('$/') && match && match.index) {
      uri = `lbry://${path.slice(0, match.index)}`;
    }
  }

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
};

export default connect(select, perform)(Router);
