import { connect } from 'react-redux';
import { selectUserVerifiedEmail } from 'lbryinc';
import { selectScrollStartingPosition } from 'redux/selectors/app';
import Router from './view';
import { normalizeURI, makeSelectTitleForUri } from 'lbry-redux';

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
  };
};

export default connect(select)(Router);
