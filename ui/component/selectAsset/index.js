import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import SelectThumbnail from './view';

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(
  null,
  perform
)(SelectThumbnail);
