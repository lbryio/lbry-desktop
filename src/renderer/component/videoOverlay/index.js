import { connect } from 'react-redux';
import { selectPlayingUri } from 'redux/selectors/content';
import { doSetPlayingUri, doPlayUri } from 'redux/actions/content';
import { doNavigate } from 'redux/actions/navigation';
import { doPlay, doPause } from 'redux/actions/media';
import { selectMediaPaused } from 'redux/selectors/media';
import VideoOverlay from './view';

const select = state => ({
  playingUri: selectPlayingUri(state),
  mediaPaused: selectMediaPaused(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  cancelPlay: () => dispatch(doSetPlayingUri(null)),
  play: uri => dispatch(doPlayUri(uri)),
  doPause: () => dispatch(doPause()),
});

export default connect(select, perform)(VideoOverlay);
