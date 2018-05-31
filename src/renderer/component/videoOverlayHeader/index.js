import { connect } from 'react-redux';
import { makeSelectTitleForUri } from 'lbry-redux';
import VideoOverlayHeader from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
  onClose: props.onClose,
});

export default connect(select, null)(VideoOverlayHeader);
