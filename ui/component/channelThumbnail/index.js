import { connect } from 'react-redux';
import { makeSelectThumbnailForUri } from 'lbry-redux';
import ChannelThumbnail from './view';

const select = (state, props) => ({
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
});

export default connect(
  select,
  null
)(ChannelThumbnail);
