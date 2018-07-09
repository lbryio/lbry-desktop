import { connect } from 'react-redux';
import { selectPlayingUri } from 'redux/selectors/content';
import { doSetPlayingUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { doPlay, doPause, doHideOverlay } from 'redux/actions/media';
import { selectMediaPaused, selectShowOverlay } from 'redux/selectors/media';
import VideoOverlay from './view';

const select = state => ({
  playingUri: selectPlayingUri(state),
  mediaPaused: selectMediaPaused(state),
  showOverlay: selectShowOverlay(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  doCancelPlay: () => dispatch(doSetPlayingUri(null)),
  doHideOverlay: () => dispatch(doHideOverlay()),
  doPlay: () => dispatch(doPlay()),
  doPause: () => dispatch(doPause()),
});

export default connect(
  select,
  perform
)(VideoOverlay);
