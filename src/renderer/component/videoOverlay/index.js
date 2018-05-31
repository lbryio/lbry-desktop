import { connect } from 'react-redux';
import { selectPlayingUri } from 'redux/selectors/content';
import { doSetPlayingUri } from 'redux/actions/content';
import VideoOverlay from './view';

const select = state => ({
  playingUri: selectPlayingUri(state),
});

const perform = dispatch => ({
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
});

export default connect(select, perform)(VideoOverlay);
