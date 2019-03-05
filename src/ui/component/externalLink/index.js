import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import { doNavigate } from 'redux/actions/navigation';
import ExternalLink from './view';

const select = () => ({});
const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
});

export default connect(
  select,
  perform
)(ExternalLink);
