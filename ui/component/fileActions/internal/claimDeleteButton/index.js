import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import ClaimDeleteButton from './view';

const perform = {
  doOpenModal,
};

export default connect(null, perform)(ClaimDeleteButton);
