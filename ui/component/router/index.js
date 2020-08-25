import { connect } from 'react-redux';
import { selectUser, selectUserVerifiedEmail } from 'redux/selectors/user';
import { selectHasNavigated, selectScrollStartingPosition, selectWelcomeVersion } from 'redux/selectors/app';
import Router from './view';
import { normalizeURI, makeSelectTitleForUri, SETTINGS } from 'lbry-redux';
import { doSetHasNavigated, doSyncWithPreferences, doGetAndPopulatePreferences } from 'redux/actions/app';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doSyncClientSettings } from 'redux/actions/settings';
const select = state => {
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
    syncEnabled: makeSelectClientSetting(SETTINGS.ENABLE_SYNC)(state),
    user: selectUser(state),
  };
};

const perform = dispatch => ({
  setHasNavigated: () => dispatch(doSetHasNavigated()),
  syncSettings: () => dispatch(doSyncClientSettings()),
  checkSync: () => dispatch(doSyncWithPreferences()),
  updatePreferences: () => dispatch(doGetAndPopulatePreferences()),
});

export default connect(select, perform)(Router);
