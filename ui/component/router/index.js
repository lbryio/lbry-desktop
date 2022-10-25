import { connect } from 'react-redux';
import { selectHasNavigated, selectScrollStartingPosition, selectWelcomeVersion } from 'redux/selectors/app';
import { selectHomepageData } from 'redux/selectors/settings';
import Router from './view';
import { normalizeURI } from 'util/lbryURI';
import { selectTitleForUri } from 'redux/selectors/claims';
import { doSetHasNavigated } from 'redux/actions/app';

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
    welcomeVersion: selectWelcomeVersion(state),
    hasNavigated: selectHasNavigated(state),
    homepageData: selectHomepageData(state),
  };
};

const perform = (dispatch) => ({
  setHasNavigated: () => dispatch(doSetHasNavigated()),
});

export default connect(select, perform)(Router);
