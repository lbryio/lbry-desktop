import { connect } from 'react-redux';
import { selectCollectionForIdHasClaimUrl } from 'redux/selectors/collections';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import FileWatchLaterLink from './view';
import { doPlaylistAddAndAllowPlaying } from 'redux/actions/content';

const select = (state, props) => {
  const { uri } = props;

  return {
    hasClaimInWatchLater: selectCollectionForIdHasClaimUrl(state, COLLECTIONS_CONSTS.WATCH_LATER_ID, uri),
  };
};

const perform = {
  doPlaylistAddAndAllowPlaying,
};

export default connect(select, perform)(FileWatchLaterLink);
