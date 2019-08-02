import { connect } from 'react-redux';
import { doChangeVolume, doChangeMute } from 'redux/actions/app';
import { selectVolume, selectMute } from 'redux/selectors/app';
import { savePosition } from 'redux/actions/content';
import { makeSelectContentPositionForUri } from 'redux/selectors/content';
import VideoViewer from './view';

const select = (state, props) => ({
  volume: selectVolume(state),
  position: makeSelectContentPositionForUri(props.uri)(state),
  muted: selectMute(state),
});

const perform = dispatch => ({
  changeVolume: volume => dispatch(doChangeVolume(volume)),
  savePosition: (claimId, outpoint, position) => dispatch(savePosition(claimId, outpoint, position)),
  changeMute: muted => dispatch(doChangeMute(muted)),
});

export default connect(
  select,
  perform
)(VideoViewer);
