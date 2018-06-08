import { connect } from 'react-redux';
import { doNotify } from 'lbry-redux';
import SelectThumbnail from './view';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doNotify(modal, props)),
});

export default connect(
  null,
  perform
)(SelectThumbnail);
