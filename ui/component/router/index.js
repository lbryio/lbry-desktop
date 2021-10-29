import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasNavigated, selectScrollStartingPosition, selectWelcomeVersion } from 'redux/selectors/app';
import { selectHomepageData } from 'redux/selectors/settings';
import Router from './view';
import { normalizeURI } from 'util/lbryURI';
import { makeSelectTitleForUri } from 'redux/selectors/claims';
import { doSetHasNavigated } from 'redux/actions/app';
import { doUserSetReferrer } from 'redux/actions/user';
import { selectHasUnclaimedRefereeReward } from 'redux/selectors/rewards';

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
    title: makeSelectTitleForUri(uri)(state),
    currentScroll: selectScrollStartingPosition(state),
    isAuthenticated: selectUserVerifiedEmail(state),
    welcomeVersion: selectWelcomeVersion(state),
    hasNavigated: selectHasNavigated(state),
    hasUnclaimedRefereeReward: selectHasUnclaimedRefereeReward(state),
    homepageData: selectHomepageData(state),
  };
};

const perform = (dispatch) => ({
  setHasNavigated: () => dispatch(doSetHasNavigated()),
  setReferrer: (referrer) => dispatch(doUserSetReferrer(referrer)),
});

export default connect(select, perform)(Router);
