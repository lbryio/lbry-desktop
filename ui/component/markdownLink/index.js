import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import MarkdownLink from './view';

const select = () => ({});
const perform = (dispatch) => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(select, perform)(MarkdownLink);
