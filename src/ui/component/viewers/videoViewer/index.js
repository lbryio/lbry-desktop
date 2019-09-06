import { connect } from 'react-redux';
import { makeSelectFileInfoForUri } from 'lbry-redux';
import { doChangeVolume, doChangeMute } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition, doSetPlayingUri } from 'redux/actions/content';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import VideoViewer from './view';

const select = (state, props) => ({
  volume: selectVolume(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
  muted: selectMute(state),
  hasFileInfo: Boolean(makeSelectFileInfoForUri(props.uri)(state)),
});

const perform = dispatch => ({
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  savePosition: (uri, position) => dispatch(savePosition(uri, position)),
  changeMute: muted => dispatch(doChangeMute(muted)),
  setPlayingUri: uri => dispatch(doSetPlayingUri(uri)),
});

export default connect(
  select,
  perform
)(VideoViewer);
