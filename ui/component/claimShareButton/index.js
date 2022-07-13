import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import ClaimShareButton from './view';

const perform = {
  doOpenModal,
};

export default connect(null, perform)(ClaimShareButton);
