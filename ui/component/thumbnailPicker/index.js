import { connect } from 'react-redux';

import ThumbnailPicker from './view';
import { makeSelectThumbnailForUri } from 'lbry-redux';

const select = (state, props) => ({
  thumbnailForUri: makeSelectThumbnailForUri(props.uri)(state),
});

// const perform = dispatch => ({
// });

export default connect(select)(ThumbnailPicker);
