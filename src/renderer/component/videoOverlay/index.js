import { connect } from 'react-redux';
import { selectPlayingUri } from 'redux/selectors/content';
import VideoOverlay from './view';

const select = state => ({
  playingUri: selectPlayingUri(state),
});

export default connect(select, null)(VideoOverlay);
